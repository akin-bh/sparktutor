<div align="center">
  
  <img src="public/images/logo/logo.png" alt="SparkTutor Logo" width="150"/>
  
#
  
  <img src="public/images/photo/app.jpeg" alt="Apps Competition Logo" width="200"/>
  
  ### 🎥 Watch Demo Video
  
  [![SparkTutor Demo](https://img.youtube.com/vi/4j6ke9dORpE/maxresdefault.jpg)](https://www.youtube.com/watch?v=4j6ke9dORpE)
  
  *Click the image above to watch our interactive demo on YouTube*
  
</div>

## Project Overview

A voice-controlled interactive learning platform built with OpenAI's Realtime API. Students can engage with educational animations through natural speech, making complex scientific concepts accessible and engaging.

### Key Features
- **Voice-Controlled Learning**: Natural language interaction with AI teacher
- **Interactive Animations**: Educational content with real-time parameter control
- **Modern UI**: Minimalist Apple-inspired design with responsive layout
- **Real-time Communication**: WebRTC audio processing and iframe control

### Architecture
![System Architecture](system%20architecture%20diagram.jpg)

- **Backend**: Flask server with OpenAI Realtime API integration
- **Frontend**: Vanilla JavaScript with WebRTC for real-time audio
- **Communication**: postMessage API for iframe control
- **Security**: Ephemeral token system, no client-side API keys

## Setup and Run Instructions

### Prerequisites
- Python 3.8+
- OpenAI API key with Realtime API access
- Modern browser with WebRTC support

### Installation

1. **Environment Setup**
   ```bash
   cd sparktutor
   pip install -r requirements.txt
   ```

2. **Configuration**
   
   Create `.env` in project root:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Run Server**
   ```bash
   python ai_science_teacher.py
   ```

4. **Access Application**
   
   Navigate to `http://localhost:3000`


### Adding New Animations

1. Create HTML file in `test_animations/`
2. Add Flask route in `ai_science_teacher.py`
3. Define function calling tools in `ai_teacher_interface.html`
4. Implement postMessage handlers for iframe communication

### Usage Examples

**Voice Commands**
- "Show me [subject]" - Display animation
- "Set wall height to 15 feet" - Adjust Pythagorean theorem parameters
- "Set sunlight to high" - Control photosynthesis simulation

---

**Manual Controls**
Use the sidebar to select animations or adjust parameters without voice commands.

## Dependencies and Tools Used

### Backend Dependencies
- **Flask**: Web framework for the server
- **OpenAI**: Realtime API for AI-powered interactions
- **Python 3.8+**: Core runtime environment

### Frontend Technologies
- **Vanilla JavaScript**: Core application logic
- **WebRTC**: Real-time audio processing
- **HTML5/CSS3**: Modern responsive interface
- **postMessage API**: Secure iframe communication

### Development Tools
- **uv**: Python package management
- **requirements.txt**: Python dependency specification
- **pyproject.toml**: Project configuration


## Team Members and Roles

### Development Team
- **Anuj Bhattarai**: Developer
- **Pradip Basnet**: Designer



### License
MIT License - see LICENSE file for details.

---

Built for UNM App Contest 2025
