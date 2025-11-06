# Integration Guide

This guide covers integrating new animations with the AI Science Teacher's voice control system.

## Overview

The AI Science Teacher uses a three-layer architecture:
1. **Flask Backend** - Serves animations and manages OpenAI sessions
2. **Main Interface** - Handles voice processing and function calling
3. **Animation iframes** - Isolated educational content with postMessage API

## Adding New Animations

### 1. Create Animation File

Create your HTML animation in `test_animations/`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Your Animation</title>
</head>
<body>
    <!-- Your animation content -->
    
    <script>
        // Required: postMessage listener for AI control
        window.addEventListener('message', function(event) {
            if (event.data && typeof event.data === 'object') {
                const message = event.data;
                
                switch(message.type) {
                    case 'your_control_type':
                        // Handle control message
                        break;
                    case 'getStatus':
                        sendStatusUpdate();
                        break;
                }
            }
        });
        
        // Required: Status reporting function
        function sendStatusUpdate() {
            const status = {
                type: 'yourAnimationStatus',
                // Your status data
            };
            
            if (window.parent !== window) {
                window.parent.postMessage(status, '*');
            }
        }
    </script>
</body>
</html>
```

### 2. Add Flask Route

In `ai_science_teacher.py`:

```python
@app.route('/your_animation')
def your_animation():
    """Serve your animation"""
    return send_file('/test_animations/your_animation.html')
```

### 3. Define Function Calling Tools

In `ai_teacher_interface.html`, add to `availableFunctions`:

```javascript
show_your_animation: {
    name: "show_your_animation",
    description: "Show your animation when user requests it",
    parameters: { type: "object", properties: {}, required: [] }
},
your_control_function: {
    name: "your_control_function", 
    description: "Control animation parameters",
    parameters: {
        type: "object",
        properties: {
            parameter: { type: "string", description: "Parameter description" }
        },
        required: ["parameter"]
    }
}
```

### 4. Implement Function Handlers

Add cases to `executeFunction()`:

```javascript
case 'show_your_animation':
    document.getElementById('whiteboardEmpty').style.display = 'none';
    document.getElementById('yourContainer').classList.remove('hidden');
    // Hide other animations
    document.querySelectorAll('.animation-option').forEach(option => option.classList.remove('active'));
    document.getElementById('yourOption').classList.add('active');
    return { success: true, message: "Your animation is now visible!" };

case 'your_control_function':
    const param = arguments.parameter;
    sendMessageToYourAnimation({ type: 'your_control_type', value: param });
    return { success: true, message: `Parameter set to ${param}` };
```

### 5. Add Sidebar Option

In the HTML sidebar section:

```html
<div class="animation-option" onclick="selectAnimation('your_animation')" id="yourOption">
    <h4>🎯 Your Animation</h4>
    <p>Subject Description</p>
</div>
```

### 6. Create iframe Container

Add to the whiteboard section:

```html
<div id="yourContainer" class="animation-container hidden">
    <iframe id="yourIframe" class="your-iframe" src="/your_animation"></iframe>
</div>
```

### 7. Implement Communication Function

Add communication helper:

```javascript
function sendMessageToYourAnimation(message) {
    const iframe = document.getElementById('yourIframe');
    
    function attemptSend(retryCount = 0) {
        const currentIframe = document.getElementById('yourIframe');
        
        if (currentIframe && currentIframe.contentWindow && currentIframe.contentDocument) {
            try {
                if (currentIframe.contentDocument.readyState === 'complete') {
                    currentIframe.contentWindow.postMessage(message, '*');
                    log(`✅ Sent message to your animation: ${JSON.stringify(message)}`);
                    return true;
                }
            } catch (error) {
                log(`❌ Error sending message: ${error.message}`);
            }
        }
        
        if (retryCount < 5) {
            setTimeout(() => attemptSend(retryCount + 1), (retryCount + 1) * 500);
        }
    }
    
    attemptSend();
}
```

## Best Practices

### Animation Design
- Keep animations focused on single concepts
- Use clear, age-appropriate visuals
- Provide immediate feedback for parameter changes
- Include educational context and explanations

### Voice Control Integration
- Design intuitive voice commands
- Provide clear function descriptions for AI
- Handle edge cases gracefully
- Give meaningful success/error messages

### Performance
- Optimize animation performance for smooth interaction
- Use efficient postMessage communication
- Minimize iframe loading time
- Handle iframe lifecycle properly

### Security
- Validate all postMessage data
- Use origin checking in production
- Avoid exposing sensitive data in iframes
- Sanitize user inputs

## Message Protocol

### Standard Message Types

**Control Messages** (Parent → iframe)
```javascript
{ type: 'controlType', value: 'parameter' }
{ type: 'getStatus' }
```

**Status Messages** (iframe → Parent)
```javascript
{ 
    type: 'animationStatus',
    // Animation-specific status data
}
```

### Error Handling

Always implement error handling in your postMessage listeners:

```javascript
window.addEventListener('message', function(event) {
    try {
        if (event.data && typeof event.data === 'object') {
            // Process message
        }
    } catch (error) {
        console.error('Message handling error:', error);
    }
});
```

## Testing

### Manual Testing
1. Load animation via sidebar
2. Test voice commands
3. Verify parameter changes
4. Check status reporting

### Debug Tools
- Use `/debug` interface for function call monitoring
- Check browser console for postMessage logs
- Test iframe communication with `testYourAnimationComm()`

### Common Issues
- **iframe not loading**: Check Flask route and file path
- **postMessage not working**: Verify iframe is fully loaded
- **Voice commands ignored**: Check function descriptions and parameters
- **Status not updating**: Ensure status messages are properly formatted

## Examples

See existing animations for reference:
- `ladder_safety.html` - Parameter control with real-time calculations
- `photosynthesis.html` - Multi-parameter animation with process control

Both demonstrate complete integration patterns including voice control, manual interaction, and status reporting.
