// Main application JS — extracted from ai_teacher_interface.html
let pc, dc;
let isConnected = false;
let sessionId = null;

function log(msg) {
    const el = document.getElementById('log');
    if (!el) return;
    el.innerHTML += new Date().toLocaleTimeString() + ': ' + msg + '\n';
    el.scrollTop = el.scrollHeight;
}

function logFunctionCall(functionName, args, result) {
    const functionCalls = document.getElementById('functionCalls');
    if (!functionCalls) return;
    const timestamp = new Date().toLocaleTimeString();
    functionCalls.innerHTML += `<div>[${timestamp}] <strong>${functionName}</strong>(${JSON.stringify(args)}) → ${result}</div>`;
}

function updateStatus(msg) {
    const statusEl = document.getElementById('status');
    if (statusEl) statusEl.textContent = msg;
    log(msg);
}

function executeFunction(functionName, args) {
    log(`Executing function: ${functionName} with args: ${JSON.stringify(args)}`);
    
    switch(functionName) {
        case 'show_ladder_animation':
            // Show unified animation iframe and point it to ladder route
            const whiteW = document.getElementById('whiteboardEmpty'); if (whiteW) whiteW.style.display = 'none';
            const animContainer = document.getElementById('animationContainer'); if (animContainer) animContainer.classList.remove('hidden');
            const iframe = document.getElementById('animationIframe'); if (iframe && iframe.src.indexOf('/ladder_safety') === -1) iframe.src = '/ladder_safety';
            document.querySelectorAll('.animation-option').forEach(option => option.classList.remove('active'));
            const ladderOpt2 = document.getElementById('ladderOption'); if (ladderOpt2) ladderOpt2.classList.add('active');
            logFunctionCall('show_ladder_animation', args, 'Ladder animation shown');
            return { success: true, message: "Ladder safety animation is now visible! You can now control the wall height and distance." };
            
        case 'close_ladder_animation':
            const animContC = document.getElementById('animationContainer'); if (animContC) animContC.classList.add('hidden');
            const whiteC = document.getElementById('whiteboardEmpty'); if (whiteC) whiteC.style.display = 'flex';
            document.querySelectorAll('.animation-option').forEach(option => option.classList.remove('active'));
            logFunctionCall('close_ladder_animation', args, 'Ladder animation hidden');
            return { success: true, message: "Ladder animation has been closed." };

        case 'show_photosynthesis_animation':
            const whiteP = document.getElementById('whiteboardEmpty'); if (whiteP) whiteP.style.display = 'none';
            const animContainerP = document.getElementById('animationContainer'); if (animContainerP) animContainerP.classList.remove('hidden');
            const iframeP = document.getElementById('animationIframe'); if (iframeP && iframeP.src.indexOf('/photosynthesis') === -1) iframeP.src = '/photosynthesis';
            document.querySelectorAll('.animation-option').forEach(option => option.classList.remove('active'));
            const photoOpt2 = document.getElementById('photosynthesisOption'); if (photoOpt2) photoOpt2.classList.add('active');
            setTimeout(() => {
                console.log('🌱 Auto-starting photosynthesis animation...');
                sendMessageToPhotosynthesis({ type: 'controlProcess', value: 'start' });
            }, 1500);
            logFunctionCall('show_photosynthesis_animation', args, 'Photosynthesis animation shown and auto-started');
            return { success: true, message: "Photosynthesis animation is now visible and starting! You can now control sunlight, CO2, and water levels." };

        case 'close_photosynthesis_animation':
            const animContPC = document.getElementById('animationContainer'); if (animContPC) animContPC.classList.add('hidden');
            const whitePC = document.getElementById('whiteboardEmpty'); if (whitePC) whitePC.style.display = 'flex';
            document.querySelectorAll('.animation-option').forEach(option => option.classList.remove('active'));
            logFunctionCall('close_photosynthesis_animation', args, 'Photosynthesis animation hidden');
            return { success: true, message: "Photosynthesis animation has been closed." };

        case 'set_wall_height':
            const height = args.height;
            sendMessageToLadder({ type: 'setWallHeight', value: height });
            logFunctionCall('set_wall_height', args, `Wall height set to ${height} feet`);
            return { success: true, message: `Wall height has been set to ${height} feet. The ladder length and safety status will update automatically.` };

        case 'set_ladder_distance':
            const distance = args.distance;
            sendMessageToLadder({ type: 'setDistance', value: distance });
            logFunctionCall('set_ladder_distance', args, `Distance set to ${distance} feet`);
            return { success: true, message: `Ladder distance has been set to ${distance} feet from the wall. Check the safety indicator!` };

        case 'explain_pythagorean':
            const mathFocus = args.focus || 'all';
            sendMessageToLadder({ type: 'highlightMath', focus: mathFocus });
            logFunctionCall('explain_pythagorean', args, `Highlighting ${mathFocus}`);
            return { success: true, message: `Highlighting the ${mathFocus} aspect of the Pythagorean theorem. The formula is a² + b² = c² where 'a' is distance from wall, 'b' is wall height, and 'c' is ladder length.` };

        case 'get_ladder_status':
            sendMessageToLadder({ type: 'getStatus' });
            logFunctionCall('get_ladder_status', args, 'Status requested');
            return { success: true, message: "Getting current ladder measurements and safety status..." };

        case 'set_sunlight_intensity':
            const intensity = args.intensity;
            sendMessageToPhotosynthesis({ type: 'setSunlight', value: intensity });
            logFunctionCall('set_sunlight_intensity', args, `Sunlight set to ${intensity}`);
            return { success: true, message: `Sunlight intensity has been set to ${intensity}. Watch how it affects the photosynthesis rate!` };

        case 'set_co2_level':
            const co2Level = args.level;
            sendMessageToPhotosynthesis({ type: 'setCO2', value: co2Level });
            logFunctionCall('set_co2_level', args, `CO2 level set to ${co2Level}`);
            return { success: true, message: `CO2 concentration has been set to ${co2Level}. This is a key ingredient for photosynthesis!` };

        case 'set_water_availability':
            const waterLevel = args.availability;
            sendMessageToPhotosynthesis({ type: 'setWater', value: waterLevel });
            logFunctionCall('set_water_availability', args, `Water availability set to ${waterLevel}`);
            return { success: true, message: `Water availability has been set to ${waterLevel}. Plants need water for photosynthesis!` };

        case 'control_photosynthesis':
            const action = args.action;
            sendMessageToPhotosynthesis({ type: 'controlProcess', value: action });
            logFunctionCall('control_photosynthesis', args, `Photosynthesis ${action}`);
            return { success: true, message: `Photosynthesis process has been ${action}ed. Observe the changes in the animation!` };

        case 'explain_photosynthesis':
            const bioFocus = args.focus || 'all';
            sendMessageToPhotosynthesis({ type: 'explainProcess', focus: bioFocus });
            logFunctionCall('explain_photosynthesis', args, `Explaining ${bioFocus}`);
            return { success: true, message: `Highlighting the ${bioFocus} aspect of photosynthesis. The equation is 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂!` };

        case 'get_photosynthesis_status':
            sendMessageToPhotosynthesis({ type: 'getStatus' });
            logFunctionCall('get_photosynthesis_status', args, 'Photosynthesis status requested');
            return { success: true, message: "Getting current photosynthesis parameters and production rates..." };
            
        default:
            return { success: false, message: `Unknown function: ${functionName}` };
    }
}

// Communication with ladder iframe
function sendMessageToLadder(message) {
    // Post a message to the active animation iframe when it is showing ladder
    const iframe = document.getElementById('animationIframe');
    if (iframe && iframe.contentWindow && iframe.src && iframe.src.includes('/ladder')) {
        iframe.contentWindow.postMessage(message, '*');
        log(`Sent message to ladder: ${JSON.stringify(message)}`);
    } else {
        log('Ladder iframe not ready or not active');
    }
}

// Communication with photosynthesis iframe
function sendMessageToPhotosynthesis(message) {
    // Use the unified animation iframe; only send when the photosynthesis page is active
    const iframe = document.getElementById('animationIframe');
    console.log('🔍 Attempting to send message to photosynthesis iframe:', message);
    console.log('🔍 Iframe element:', iframe);
    console.log('🔍 Iframe contentWindow:', iframe ? iframe.contentWindow : 'null');
    
    function attemptSend(retryCount = 0) {
    const currentIframe = document.getElementById('animationIframe');
        
        if (currentIframe && currentIframe.contentWindow && currentIframe.contentDocument) {
            try {
                // Only send if the iframe is currently pointing at the photosynthesis page
                if (!currentIframe.src || !currentIframe.src.includes('/photosynthesis')) {
                    console.log('🔍 animationIframe is not the photosynthesis page; aborting send');
                    return false;
                }

                // Check if iframe is fully loaded
                if (currentIframe.contentDocument.readyState === 'complete') {
                    currentIframe.contentWindow.postMessage(message, '*');
                    log(`✅ Sent message to photosynthesis: ${JSON.stringify(message)}`);
                    console.log('✅ Photosynthesis message sent successfully:', message);
                    return true;
                } else {
                    console.log('🔄 Iframe not fully loaded, waiting...');
                }
            } catch (error) {
                log(`❌ Error sending message to photosynthesis: ${error.message}`);
                console.error('❌ Error sending message:', error);
            }
        }
        
        // Retry up to 5 times with increasing delays
        if (retryCount < 5) {
            const delay = (retryCount + 1) * 500; // 500ms, 1s, 1.5s, 2s, 2.5s
            console.log(`🔄 Retrying in ${delay}ms (attempt ${retryCount + 1}/5)...`);
            setTimeout(() => attemptSend(retryCount + 1), delay);
        } else {
            log('❌ Failed to send message after 5 attempts');
            console.log('❌ All retry attempts failed');
        }
    }
    
    attemptSend();
}

// Listen for messages from iframes
window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'ladderStatus') {
        log(`Received ladder status: ${JSON.stringify(event.data)}`);
    } else if (event.data && event.data.type === 'photosynthesisStatus') {
        log(`Received photosynthesis status: ${JSON.stringify(event.data)}`);
    }
});

// Add iframe load listeners
window.addEventListener('DOMContentLoaded', function() {
    const animIframe = document.getElementById('animationIframe');

    if (animIframe) {
        animIframe.addEventListener('load', function() {
            console.log('� Animation iframe loaded - src=', animIframe.src);
            log('Animation iframe ready for communication: ' + animIframe.src);
        });
    }
});

// Manual animation selection functions
function selectAnimation(type) {
    document.querySelectorAll('.animation-option').forEach(option => { option.classList.remove('active'); });
    // Use a single animation iframe and swap its src based on selection
    const white = document.getElementById('whiteboardEmpty'); if (white) white.style.display = 'none';
    const iframe = document.getElementById('animationIframe');
    const container = document.getElementById('animationContainer');
    // Map animation keys to routes
    const routeMap = {
        'ladder': '/ladder_safety',
        'photosynthesis': '/photosynthesis',
        'tree_height': '/tree_height',
        'airplanes': '/how_airplanes_fly',
        'projectile': '/projectile_motion',
        'moon': '/phases_of_moon',
        'integration': '/integration_area_under_curve',
        'nepal': '/nepal_heritage'
    };

    const route = routeMap[type];
    if (!route) { log('Unknown animation type: ' + type); return; }

    // Show container and set iframe src (only reload if different to preserve state when possible)
    if (container) container.classList.remove('hidden');
    if (iframe) {
        if (iframe.src.indexOf(route) === -1) {
            iframe.src = route;
        }
    }

    // Update sidebar active state
    const opt = document.getElementById(type === 'tree_height' ? 'treeHeightOption' : (type + 'Option'));
    if (opt) opt.classList.add('active');
    log(`Manual selection: ${type} animation (route: ${route})`);
}

function clearAnimation() {
    const animCont = document.getElementById('animationContainer'); if (animCont) animCont.classList.add('hidden');
    const white = document.getElementById('whiteboardEmpty'); if (white) white.style.display = 'flex';
    const iframe = document.getElementById('animationIframe'); if (iframe) iframe.src = '';
    document.querySelectorAll('.animation-option').forEach(option => option.classList.remove('active'));
    log('Manual selection: Cleared whiteboard');
}

function selectGrade(grade, event) {
    document.querySelectorAll('.grade-btn').forEach(btn => btn.classList.remove('active'));
    // Support inline onclick which may not pass event — fall back to window.event
    if (!event) event = window.event;
    if (event && event.target) event.target.classList.add('active');
    log(`Grade level selected: ${grade}`);
}

function testPhotosynthesisComm() {
    console.log('🧪 Testing photosynthesis iframe communication...');
    sendMessageToPhotosynthesis({ type: 'getStatus' });
}

window.testPhotosynthesisComm = testPhotosynthesisComm;

// Expose executeFunction to the window for easy testing from the browser console
window.executeFunction = executeFunction;

async function init() {
    console.log('Init function called!');
    try {
        updateStatus('Getting ephemeral token...');
        console.log('Fetching session token...');
        const response = await fetch('/session');
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        const EPHEMERAL_KEY = data.client_secret.value;
        sessionId = data.id;
        updateStatus('Token received, initializing WebRTC...');
        pc = new RTCPeerConnection();
        const audio = document.createElement('audio'); audio.autoplay = true; pc.ontrack = e => audio.srcObject = e.streams[0];
        const stream = await navigator.mediaDevices.getUserMedia({audio: true});
        stream.getTracks().forEach(track => pc.addTrack(track, stream));
        dc = pc.createDataChannel('oai-events');
            dc.onmessage = handleRealtimeEvent;
            dc.onopen = () => {
                updateStatus('Data channel opened, configuring functions...');
                const dcEl = document.getElementById('dcStatus'); if (dcEl) { dcEl.textContent = 'open'; dcEl.style.color = '#059669'; }
                try { configureFunctions(); } catch(e) { console.error('configureFunctions error', e); }
            };
            dc.onclose = () => { const dcEl = document.getElementById('dcStatus'); if (dcEl) { dcEl.textContent = 'closed'; dcEl.style.color = '#d97706'; } updateStatus('Data channel closed'); };
            dc.onerror = (err) => { const dcEl = document.getElementById('dcStatus'); if (dcEl) { dcEl.textContent = 'error'; dcEl.style.color = '#ef4444'; } console.error('DataChannel error', err); };
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        const sdpResponse = await fetch('https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2025-06-03', {
            method: 'POST', body: offer.sdp, headers: { 'Authorization': `Bearer ${EPHEMERAL_KEY}`, 'Content-Type': 'application/sdp' }
        });
        const answer = {type: 'answer', sdp: await sdpResponse.text()};
        await pc.setRemoteDescription(answer);
        updateStatus('Connected! Say "show me ladder safety" or "show me photosynthesis" to start learning!');
    } catch (error) {
        updateStatus('Error: ' + error.message);
        log('Error: ' + error.stack);
    }
}

function configureFunctions() {
    // Provide explicit function/tool definitions so the model can perform
    // function calls for animation control instead of returning free-form
    // text only. This helps ensure reliable animation triggers.
    const tools = [
        { type: 'function', name: 'show_ladder_animation', description: 'Show the ladder safety animation (Pythagorean theorem)', parameters: { type: 'object', properties: {}, required: [] } },
        { type: 'function', name: 'close_ladder_animation', description: 'Hide the ladder safety animation', parameters: { type: 'object', properties: {}, required: [] } },
        { type: 'function', name: 'set_wall_height', description: 'Set the wall height in feet for ladder safety', parameters: { type: 'object', properties: { height: { type: 'number', description: 'Height in feet (5-25)' } }, required: ['height'] } },
        { type: 'function', name: 'set_ladder_distance', description: 'Set the ladder distance from the wall in feet', parameters: { type: 'object', properties: { distance: { type: 'number', description: 'Distance in feet (1-15)' } }, required: ['distance'] } },
        { type: 'function', name: 'explain_pythagorean', description: 'Request the UI to highlight/explain Pythagorean theorem aspects', parameters: { type: 'object', properties: { focus: { type: 'string', description: 'Which part to focus on (a,b,c,all)' } }, required: [] } },
        { type: 'function', name: 'get_ladder_status', description: 'Ask the ladder animation for its current measurements/status', parameters: { type: 'object', properties: {}, required: [] } },

        { type: 'function', name: 'show_photosynthesis_animation', description: 'Show the photosynthesis animation', parameters: { type: 'object', properties: {}, required: [] } },
        { type: 'function', name: 'close_photosynthesis_animation', description: 'Hide the photosynthesis animation', parameters: { type: 'object', properties: {}, required: [] } },
        { type: 'function', name: 'set_sunlight_intensity', description: 'Adjust sunlight intensity for photosynthesis animation', parameters: { type: 'object', properties: { intensity: { type: 'string', enum: ['low','medium','high'] } }, required: ['intensity'] } },
        { type: 'function', name: 'set_co2_level', description: 'Set the CO2 concentration level', parameters: { type: 'object', properties: { level: { type: 'string', enum: ['low','normal','high'] } }, required: ['level'] } },
        { type: 'function', name: 'set_water_availability', description: 'Set water availability for plants', parameters: { type: 'object', properties: { availability: { type: 'string', enum: ['low','normal','high'] } }, required: ['availability'] } },
        { type: 'function', name: 'control_photosynthesis', description: 'Start/pause/reset the photosynthesis process', parameters: { type: 'object', properties: { action: { type: 'string', enum: ['start','pause','reset'] } }, required: ['action'] } },
        { type: 'function', name: 'explain_photosynthesis', description: 'Request the UI to show an explanation of photosynthesis', parameters: { type: 'object', properties: { focus: { type: 'string' } }, required: [] } },
        { type: 'function', name: 'get_photosynthesis_status', description: 'Get current photosynthesis parameters and state', parameters: { type: 'object', properties: {}, required: [] } }
    ];

    const functionConfig = { type: "session.update", session: { tools: tools, tool_choice: "auto" } };
    log('Configuring functions: ' + JSON.stringify(functionConfig, null, 2));
    try { dc.send(JSON.stringify(functionConfig)); } catch (e) { console.warn('dc not ready', e); }
    setTimeout(() => {
    const instructions = { type: "session.update", session: { instructions: "You are an AI science teacher specializing in interactive education. You can control two different animations: 1) LADDER SAFETY for Pythagorean theorem (math), and 2) PHOTOSYNTHESIS for plant biology. For LADDER: use show_ladder_animation, set_wall_height (5-25 feet), set_ladder_distance (1-15 feet), explain_pythagorean, get_ladder_status. Explain the 4:1 safety rule and a² + b² = c². For PHOTOSYNTHESIS: use show_photosynthesis_animation, set_sunlight_intensity (low/medium/high), set_co2_level (low/normal/high), set_water_availability (low/normal/high), control_photosynthesis (start/pause/reset), explain_photosynthesis, get_photosynthesis_status. Explain the equation 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂. Switch between animations based on what students ask about. Be engaging and educational! IMPORTANT: Always respond verbally and in text in English (use US English). Do not switch languages. If the user speaks in another language, reply in English and offer to continue in their language only if they explicitly ask." } };
        log('Setting session instructions: ' + JSON.stringify(instructions, null, 2));
        try { dc.send(JSON.stringify(instructions)); } catch (e) { console.warn('dc not ready', e); }
    }, 1000);
}

function handleRealtimeEvent(event) {
    try {
        const data = JSON.parse(event.data);
        log('Event: ' + JSON.stringify(data, null, 2));
        const incomingEl = document.getElementById('lastIncoming'); if (incomingEl) incomingEl.textContent = data.type || JSON.stringify(data).slice(0,120);
        if (data.type === 'session.updated') updateStatus('Session updated successfully');
        if (data.type === 'response.done' && data.response && data.response.output) {
            for (const output of data.response.output) if (output.type === 'function_call') handleFunctionCall(output);
        }
        if (data.type === 'response.function_call_arguments.done') log('Function call arguments complete');
        if (data.type === 'conversation.item.created') {
            if (data.item && data.item.type === 'function_call') updateStatus('Executing function...'); else updateStatus('Processing your request...');
        }
        if (data.type === 'response.created') updateStatus('AI is thinking...');
    } catch (error) { log('Error parsing event: ' + error.message); log('Raw event data: ' + event.data); }
}

// --- Auto-trigger animations from AI text (fallback) ---
const _lastAutoTrigger = {};
function autoTriggerFromText(text) {
    if (!text || typeof text !== 'string') return false;
    const t = text.toLowerCase();
    const now = Date.now();
    const trigger = (key) => {
        // prevent repeat triggers within 6 seconds
        if (_lastAutoTrigger[key] && now - _lastAutoTrigger[key] < 6000) return false;
        _lastAutoTrigger[key] = now;
        return true;
    };

    // map keywords to animations
    if (/(ladder|pythagor|4:1|a² \+ b²|a\^2 \+ b\^2|ladder safety)/i.test(t)) {
        if (trigger('ladder')) {
            log('Auto-trigger: detected ladder/Pythagorean in AI text');
            try { executeFunction('show_ladder_animation', {}); } catch (e) { selectAnimation('ladder'); }
            return true;
        }
    }

    if (/(photosynth|chloroplast|sunlight|co2|6co2|6h2o|glucose|c6h12o6|photosynthesis)/i.test(t)) {
        if (trigger('photosynthesis')) {
            log('Auto-trigger: detected photosynthesis in AI text');
            try { executeFunction('show_photosynthesis_animation', {}); } catch (e) { selectAnimation('photosynthesis'); }
            return true;
        }
    }

    if (/(tree height|similar triangles|tree|height of the tree|measure the tree)/i.test(t)) {
        if (trigger('tree_height')) {
            log('Auto-trigger: detected tree height in AI text');
            try { selectAnimation('tree_height'); } catch (e) { executeFunction('show_tree_height', {}); }
            return true;
        }
    }

    return false;
}

function handleFunctionCall(functionCall) {
    const functionName = functionCall.name;
    const args = JSON.parse(functionCall.arguments || '{}');
    const callId = functionCall.call_id;
    log(`Function call detected: ${functionName} with args: ${JSON.stringify(args)}`);
    const lastEl = document.getElementById('lastFunctionCall'); if (lastEl) lastEl.textContent = functionName + JSON.stringify(args ? (' ' + JSON.stringify(args)) : '');
    const result = executeFunction(functionName, args);
    const functionResult = { type: "conversation.item.create", item: { type: "function_call_output", call_id: callId, output: JSON.stringify(result) } };
    log('Sending function result: ' + JSON.stringify(functionResult));
    try { dc.send(JSON.stringify(functionResult)); } catch (e) { console.warn('dc not ready', e); }
    const responseRequest = { type: "response.create" };
    try { dc.send(JSON.stringify(responseRequest)); } catch (e) { console.warn('dc not ready', e); }
}

function stopSession() {
    if (pc) pc.close();
    if (dc) dc.close();
    updateStatus('Stopped');
    isConnected = false;
}

// Note: keeping configureFunctions tools list short in this external file to avoid duplication of very large JSON.
