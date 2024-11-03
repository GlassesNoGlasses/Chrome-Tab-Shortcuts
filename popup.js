
// state variables
let state = {
    // set state variables here
    add_macro_form: false, // true if add macro form is visible
    keysPressed: [], // keys pressed by user
    isModifierKey: false, // true if a modifier key is pressed
}

// helper functions
const FilterAndFormatKeys = (keys) => {
    let filtered_keys = keys.filter((key, index) => keys.indexOf(key) === index && key.length < 6);
    filtered_keys.sort((key1, key2) => key2.length - key1.length || key2.localeCompare(key1));
    return filtered_keys.join('+');
}
  

const UpdateElementDisplay = (element, display) => {
    if (!element) {
        return;
    }

    element.style.display = display;
}

const CreateMacroElement = (name, urls, key_macro) => {
    if (!name || !urls || !key_macro) {
        console.alert("Could not create macro element");
        return;
    }

    // create macro elements
    const macro_div = document.createElement("div");
    const macro_name = document.createElement("div");
    const macro_urls = document.createElement("div");
    const macro_delete = document.createElement("button");
    const macro_delete_icon = document.createElement("img");

    // add classes to elements
    macro_div.classList.add("macro-item");
    macro_name.classList.add("macro-name");
    macro_urls.classList.add("macro-urls");
    macro_delete.classList.add("macro-delete");
    macro_delete_icon.classList.add("delete-icon");

    // set content
    macro_div.id = name;
    macro_name.textContent = `${key_macro}: ${name}`;
    macro_delete_icon.src = "./images/trash_can.svg";
    
    for (let url of urls) {
        const url_anchor = document.createElement("a");
        url_anchor.classList.add("macro-url");
        url_anchor.href = url;
        url_anchor.textContent = url;
        macro_urls.appendChild(url_anchor);
    };

    // add listeners
    macro_delete.addEventListener("click", () => {
        console.log("Deleting macro: ", name);
        macro_name.removeEventListener("click");
    });

    macro_name.addEventListener("click", () => {
        console.log("Opening macro: ", name);
        UpdateElementDisplay(macro_urls, macro_urls.style.display === "none" ? "flex" : "none");
    });

    // append elements to macro_div
    macro_name.appendChild(macro_urls);
    macro_delete.appendChild(macro_delete_icon);
    macro_div.appendChild(macro_name);
    macro_div.appendChild(macro_delete);

    return macro_div;
}

const AddNewMacro = (name, urls, key_macro) => {
    if (!name || !urls || !key_macro) {
        console.alert("Invalid macro parameters");
        return;
    }

    const macro_div = CreateMacroElement(name, urls, key_macro);
    const macro_list = document.getElementById("shortcuts");

    if (!macro_div || !macro_list) {
        console.alert("Failed to create new macro");
        return;
    }

    macro_list.appendChild(macro_div);
}

const SaveMacro = (name, urls, key_macro) => {
    try {
        if (!name || !urls || !key_macro) {
            alert("Please fill out all fields");
        };

        // parse user inputted keys
        const parsed_keys = FilterAndFormatKeys(key_macro);
        const obj = {};
        obj[parsed_keys] = {urls: urls, name: name};

        // save to local storage and add to popup if successful
        chrome.storage.local.set(obj).then((result) => {
            console.log("Saving Result: ", result);
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                return;
            }

            console.log("Saved macro: ", obj);
            AddNewMacro(name, urls, key_macro);
        });

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

const AddMacroFormSubmit = () => {
    const name = document.getElementById("form-name").value;
    const urls = document.getElementById("form-urls").value.split(',');
    const key_macro = state.keysPressed;
    console.log("key_macros: ", key_macro);

    SaveMacro(name, urls, key_macro);
}

const RecordKeyboardInputs = () => {
    console.log("Recording Keyboard Inputs");
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
document.getElementById("add-macro").addEventListener("click", () => AddMacroFormSubmit());
document.getElementById("shortcut-key-input").addEventListener("focusin", () => RecordKeyboardInputs());
document.getElementById("shortcut-key-input").addEventListener("focusout", () => RemoveKeyboardRecorder());
