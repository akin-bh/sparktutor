from flask import Flask, jsonify, send_file, send_from_directory
try:
    import openai
except Exception:
    openai = None
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# OpenAI client (optional)
if openai is not None:
    try:
        client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    except Exception:
        client = None
else:
    client = None


@app.route("/")
def index():
    """Serve the AI Science Teacher interface"""
    return send_file("ai_teacher_interface.html")


@app.route("/debug")
def debug():
    """Serve the teacher debug interface"""
    return send_file("teacher_debug.html")


@app.route("/ladder_safety")
def ladder_safety():
    """Serve the ladder safety animation"""
    return send_file("test_animations/ladder_safety.html")


@app.route("/photosynthesis")
def photosynthesis():
    """Serve the photosynthesis animation"""
    return send_file("test_animations/photosynthesis.html")


@app.route("/tree_height")
def tree_height():
    """Serve the tree height animation"""
    return send_file("test_animations/tree_height.html")


@app.route("/how_airplanes_fly")
def how_airplanes_fly():
    """Serve the airplane flight animation"""
    return send_file("test_animations/how_airplanes_fly.html")


@app.route("/projectile_motion")
def projectile_motion():
    """Serve the projectile motion animation"""
    return send_file("test_animations/projectile_motion.html")


@app.route("/phases_of_moon")
def phases_of_moon():
    """Serve the moon phases animation"""
    return send_file("test_animations/phases_of_moon.html")


@app.route("/integration_area_under_curve")
def integration_area_under_curve():
    """Serve the integration area under curve animation"""
    return send_file("test_animations/integration_area_under_curve.html")


@app.route("/nepal_heritage")
def nepal_heritage():
    """Serve the Nepal heritage animation"""
    return send_file("test_animations/nepal_heritage.html")


# Serve static asset folders (css, js, public) so referenced paths like /css/style.css work
@app.route('/css/<path:filename>')
def serve_css(filename):
    return send_from_directory('css', filename)


@app.route('/js/<path:filename>')
def serve_js(filename):
    return send_from_directory('js', filename)


@app.route('/public/<path:filename>')
def serve_public(filename):
    return send_from_directory('public', filename)


@app.route("/session")
def create_session():
    """Create an ephemeral token for OpenAI Realtime API with function calling support"""
    try:
        # If OpenAI client is not available, return a helpful error so the frontend
        # can still load and show a message instead of the whole server crashing.
        if client is None:
            msg = "OpenAI SDK not configured or not installed. Sessions are unavailable."
            print(f"❌ {msg}")
            return jsonify({"error": msg}), 501

        # Create a session with function calling capabilities
        response = client.beta.realtime.sessions.create(
            model="gpt-4o-realtime-preview-2025-06-03",
            voice="verse"
        )

        # Some OpenAI SDK response objects can be complex; return a small,
        # predictable JSON shape that the frontend expects, while keeping the
        # full response available under `raw` for debugging.
        resp_obj = response.model_dump() if hasattr(response, 'model_dump') else dict(response)
        session_id = resp_obj.get('id') or resp_obj.get('session', {}).get('id') or None
        client_secret = None
        if isinstance(resp_obj.get('client_secret'), dict) and resp_obj['client_secret'].get('value'):
            client_secret = resp_obj['client_secret']
        elif hasattr(response, 'client_secret') and getattr(response.client_secret, 'value', None):
            client_secret = { 'value': response.client_secret.value }

        print(f"✅ Created session: {session_id}")

        if not client_secret:
            # Return full response if we couldn't extract the client_secret cleanly
            return jsonify({ 'id': session_id, 'raw': resp_obj }), 200

        return jsonify({ 'id': session_id, 'client_secret': client_secret, 'raw': resp_obj }), 200

    except Exception as e:
        print(f"❌ Error creating session: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    print("🎓 Starting AI Science Teacher - Interactive Learning Assistant...")
    print("📱 Open your browser and go to: http://localhost:3000")
    print("🎤 Click 'Start Session' and grant microphone permissions")
    print("🔬 Try saying: 'show me photosynthesis' or 'explain ladder safety'")
    print("🧮 AI-Connected: Pythagorean theorem, Photosynthesis")
    print(
        "📚 Manual Animations: Tree Height, Integration, Airplanes, Projectile Motion, Moon Phases, Nepal Explorer"
    )
    print("⏹️  Press Ctrl+C to stop\n")

    port = int(os.getenv("PORT", "3000"))
    debug_mode = os.getenv("FLASK_DEBUG", "1") != "0"
    app.run(host="0.0.0.0", port=port, debug=debug_mode)
