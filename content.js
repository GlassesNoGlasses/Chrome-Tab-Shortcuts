
// Get all keys pressed, with no repeats
let keysPressed = [];
// Check if a modifier key is pressed
let isModifierKey = false;

// Get all keys pressed, with no repeats
document.addEventListener('keydown', (event) => {
    !event.repeat && keysPressed.push(event.key.toLowerCase());
    isModifierKey = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
}, false);

// Clear all keys pressed and send to background
document.addEventListener('keyup', () => {
    if (isModifierKey && keysPressed.length > 0) {
        (async () => {
            console.log("SENDING TO BACKGROUND: ", keysPressed);
            await chrome.runtime.sendMessage({from: "content", keys: keysPressed});
        })();
    }
    // reset keysPressed and isModifierKey
    keysPressed = [];
    isModifierKey = false;
}, false);
