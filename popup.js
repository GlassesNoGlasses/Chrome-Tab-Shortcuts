
// state variables
let state = {
    // set state variables here
    add_macro_form: false, // true if add macro form is visible
    keysPressed: [], // keys pressed by user
    isModifierKey: false, // true if a modifier key is pressed
}

// helper functions
const UpdateElementDisplay = (element, display) => {
    if (!element) {
        return;
    }

    element.style.display = display;
}

const CreateMacroElement = (name, urls, key_macro) => {

}

const SaveMacro = (name, urls, key_macro) => {
    try {
        if (!name || !urls || !key_macro) {
            alert("Please fill out all fields");
        };
        // TODO: save macro to chrome storage
        chrome.storage.local.set()
    } catch (error) {
        console.error(error);
    }
}

const ToggleMacroForm = () => {
    const add_macro_div = document.getElementById("add-macro-shortcut");

    if (state.add_macro_form) {
        UpdateElementDisplay(add_macro_div, "none");
        state.add_macro_form = false;
        return;
    }

    const form = document.getElementById("add-form");
    UpdateElementDisplay(add_macro_div, "flex");

}

const RecordKeyboardInputs = () => {
    state.keysPressed = [];
    state.isModifierKey = false;

    document.addEventListener('keydown', (event) => {
        !event.repeat && state.keysPressed.push(event.key.toLowerCase());
        state.isModifierKey = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
    }, false);
}

const RemoveKeyboardRecorder = () => {
    document.removeEventListener('keydown', RecordKeyboardInputs);
    console.log("KEYS PRESSED: ", state.keysPressed);
    console.log("IS MODIFIER KEY: ", state.isModifierKey);
}

// activates on popup.html load


// handle onClick listeners
document.getElementById("new-macro-button").addEventListener("click", () => ToggleMacroForm());
document.getElementById("shortcut-key-input").addEventListener("focusin", () => RecordKeyboardInputs());
document.getElementById("shortcut-key-input").addEventListener("focusout", () => RemoveKeyboardRecorder());
