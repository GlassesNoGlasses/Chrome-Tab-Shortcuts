
// TODO: Remove unecessary event listeners

// state variables
let state = {
    // set state variables here
    add_macro_form: false, // true if add macro form is visible
    keysPressed: [], // keys pressed by user
    isModifierKey: false, // true if a modifier key is pressed
    current_macros: {}, // current macros saved in local storage
}

// helper functions
const FilterAndFormatKeys = (keys) => {
    let filtered_keys = keys.filter((key, index) => keys.indexOf(key) === index && key.length < 6);
    filtered_keys.sort((key1, key2) => key2.length - key1.length || key2.localeCompare(key1));
    return filtered_keys.join('+');
}

const FetchLocalByMacro = (key_macro) => {
    for (let key in state.current_macros) {
        if (key_macro === state.current_macros[key].macro) {
            return state.current_macros[key];
        }
    };

    return null;
}
  

function UpdateElementComponent(element, component, value = null) {
    if (!element || !component) {
        return;
    }

    try {
        switch (component.toLowerCase().trim()) {
            case "display":
                element.style.display = value;
                break;
            case "class":
                element.className = value;
                break;
            case "backgroundColor":
                element.style.backgroundColor = value;
                break;
            default:
                break;
        }
    } catch (error) {
        console.error(`Failed to update component: ${component}`);
    }
};


const ShowEditView = (macro_name) => {
    if (!(macro_name in state.current_macros)) {
        console.log(macro_name);
        console.error("Failed to render Macro View");
        return;
    }

    try {
        const macro = state.current_macros[macro_name];
        const edit_urls = document.getElementById("edit-urls");
        document.getElementById("my-shortcuts").style.display = "none";
        document.getElementById("edit-view").style.display = "flex";
        document.getElementById("edit-name").value = macro.name;

        for (let url of macro.urls) {
            const url_input = CreateNewURLInput(null, url);
            edit_urls.appendChild(url_input);
        }
        
    } catch (error) {
        console.error(`Failed to edit macro: ${error}`);
    }
}


const CloseEditView = () => {
    const edit_urls = document.getElementById("edit-urls");
    const edit_view = document.getElementById("edit-view");
    const my_shortcuts = document.getElementById("my-shortcuts");
    const edit_name = document.getElementById("edit-name");

    edit_name.value = "";
    edit_urls.replaceChildren();
    edit_view.style.display = "none";
    my_shortcuts.style.display = "flex";
}


const CreateMacroElement = (name, urls, key_macro) => {
    if (!name || !urls || !key_macro) {
        console.alert("Could not create macro element");
        return;
    }

    // create macro elements
    const macro_div = document.createElement("div");
    const macro_name = document.createElement("div");
    const macro_text = document.createElement("input");
    const macro_urls = document.createElement("div");
    const macro_delete = document.createElement("button");
    const macro_delete_icon = document.createElement("img");
    const macro_edit = document.createElement("button");
    const macro_edit_icon = document.createElement("img");

    // add classes to elements
    macro_div.classList.add("macro-item");
    macro_name.classList.add("macro-name");
    macro_text.classList.add("macro-text");
    macro_urls.classList.add("macro-urls");
    macro_delete_icon.classList.add("short-icon");
    macro_edit_icon.classList.add("short-icon");


    // set content
    macro_div.id = name;
    macro_text.value = `${key_macro}: ${name}`;
    macro_text.readOnly = true;
    macro_delete_icon.src = "./images/trash_can.svg";
    macro_edit_icon.src = "./images/edit.svg";
    
    for (let url of urls) {
        const url_anchor = document.createElement("a");
        url_anchor.classList.add("macro-url");
        url_anchor.href = url;
        url_anchor.textContent = url;
        macro_urls.appendChild(url_anchor);
    };

    // add listeners
    macro_edit.addEventListener("click", () => ShowEditView(name));

    macro_delete.addEventListener("click", () => {
        const content = document.getElementById("main-content");

        macro_name.removeEventListener("click", UpdateElementComponent);
        UpdateElementComponent(content, "class", "content-shadow");
        
        const popup = ConfirmationPopup(`Are you sure you want to delete macro: ${name}?`, () => {
            chrome.storage.local.remove(key_macro).then((result) => {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                    return;
                }
                
                delete state.current_macros[key_macro];
                macro_div.remove();
                UpdateElementComponent(content, "class", "content");
            });
        });

        if (!popup) {
            console.error("Failed to create confirmation popup");
            return;
        }

        document.body.appendChild(popup);
    });

    macro_name.addEventListener("click", () => {
        macro_urls.style.display = macro_urls.style.display === "none" ? "flex" : "none";
    });

    // append elements to macro_div
    macro_name.appendChild(macro_text);
    macro_name.appendChild(macro_urls);
    macro_delete.appendChild(macro_delete_icon);
    macro_edit.appendChild(macro_edit_icon);
    macro_div.appendChild(macro_edit);
    macro_div.appendChild(macro_name);
    macro_div.appendChild(macro_delete);

    return macro_div;
}

const ConfirmationPopup = (message, onAcceptCallback) => {
    const popup_container = document.createElement("div");
    const popup = document.createElement("div");
    const popup_message = document.createElement("p");
    const popup_buttons = document.createElement("div");
    const popup_yes = document.createElement("button");
    const popup_no = document.createElement("button");

    popup_container.classList.add("confirmation-popup-container");
    popup.classList.add("confirmation-popup");
    popup_buttons.classList.add("confirmation-buttons");
    popup_message.textContent = message;
    popup_yes.textContent = "Yes";
    popup_no.textContent = "No";

    popup_yes.addEventListener("click", () => {
        onAcceptCallback && onAcceptCallback();
        popup_container.remove();
        return true;
    });

    popup_no.addEventListener("click", () => {
        popup_container.remove();
        return false;
    });

    popup_buttons.appendChild(popup_yes);
    popup_buttons.appendChild(popup_no);
    popup.appendChild(popup_message);
    popup.appendChild(popup_buttons);
    popup_container.appendChild(popup);

    return popup_container;
}

const AddNewMacro = (name, urls, key_macro) => {
    if (!name || !urls || !key_macro) {
        console.alert("Invalid macro parameters");
        return;
    } 
    else if (document.getElementById(key_macro)) {
        console.log("Macro already exists");
        return
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
        const obj = {};
        obj[key_macro] = {urls: urls, name: name};

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
    const main_content = document.getElementById("main-content");

    if (state.add_macro_form) {
        UpdateElementComponent(add_macro_div, "display", "none");
        state.add_macro_form = false;
        return;
    }

    const form = document.getElementById("add-form");
    UpdateElementComponent(main_content, "class", "content-shadow");
    UpdateElementComponent(add_macro_div, "display", "flex");
}

const AddMacroFormSubmit = () => {
    const name = document.getElementById("form-name").value;
    const key_macro = document.getElementById("shortcut-key-input").value;
    const url_list = document.getElementsByClassName("url-option");
    let urls = [];

    for (let url of url_list) {
        urls.push(url.value);
    }

    SaveMacro(name, urls, key_macro);
}

const RecordKeyboardInputs = (id, keyupCallback) => {
    console.log("Recording Keyboard Inputs");

    AddEventListenerById(id, "keydown", (event) => {
        !event.repeat && state.keysPressed.push(event.key.toLowerCase());
        state.isModifierKey = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
    }, false);

    AddEventListenerById(id, "keyup", () => {
        keyupCallback && keyupCallback();
        state.keysPressed = [];
        state.isModifierKey = false;
    });
}

const RemoveKeyboardRecorder = (id) => {
    RemoveEventListenerById(id, "keydown");
    RemoveEventListenerById(id, "keyup");
}

const AddEventListenerById = (id, event, callback = null) => {
    try {
        const element = document.getElementById(id);
        element.addEventListener(event, callback);
    } catch (error) {
        console.error(`Error adding event listener to ${id}: ${error}`);
    }
}

const RemoveEventListenerById = (id, event, callback = null) => {
    try {
        const element = document.getElementById(id);
        element.removeEventListener(event, callback);
    } catch (error) {
        console.error(`Error removing event listener from ${id}: ${error}`);
    }
}

const OnShortcutKeyInputFocus = () => {
    //TODO: Fix double key press bug
    console.log("Focused In");
    RemoveKeyboardRecorder("body");
    RecordKeyboardInputs("shortcut-key-input", () => {
        const shortcut_key_input = FilterAndFormatKeys(state.keysPressed);
        if (shortcut_key_input) {
            document.getElementById("shortcut-key-input").value = shortcut_key_input;
        }
    });
};

const OnShortcutKeyInputBlur = () => {
    RemoveKeyboardRecorder("shortcut-key-input");
    RecordKeyboardInputs("body", CreateTabs);
}

const CreateTabs = () => {
    if (!state.keysPressed.length || !state.isModifierKey) return;

    try {
        const key_macro = FilterAndFormatKeys(state.keysPressed);
        const macro_object = FetchLocalByMacro(key_macro);
        if (!macro_object) return;
    
        const urls = macro_object.urls;
        const active_url = macro_object.active_url;
        const pinned_urls = macro_object.pinned_urls;
    
        urls.forEach(url => {
            chrome.tabs.create({ 
            url: url, 
            active: active_url && !url.localeCompare(active_url),
            pinned: pinned_urls.includes(url)
            });
        });
    } catch (error) {
        console.error(`Failed to initialize macro: ${error}`);
    }
}

const CreateNewURLInput = (class_name = "url-option", value = null) => {
    const url_option = document.createElement("input");
    url_option.classList.add(class_name ? class_name : "url-option");
    url_option.placeholder = "Enter URL";
    url_option.required = true;
    url_option.name = "url_option";

    if (value) url_option.value = value;

    return url_option;
}

const AddNewURLOption = () => {
    const url_list = document.getElementById("added-urls");
    const url_input = CreateNewURLInput()
    url_list.appendChild(url_input);
};

// activates on popup.html load
const InitializePopup = () => {
    console.log("Initializing Popup");

    // add event listeners
    AddEventListenerById("new-macro-button", "click", ToggleMacroForm);
    AddEventListenerById("add-macro", "click", AddMacroFormSubmit);
    RecordKeyboardInputs("body", CreateTabs);
    AddEventListenerById("shortcut-key-input", "focusin", OnShortcutKeyInputFocus);
    AddEventListenerById("shortcut-key-input", "focusout", OnShortcutKeyInputBlur);
    AddEventListenerById("add-url", "click", AddNewURLOption);
    AddEventListenerById("edit-save", "click", AddNewMacro);
    AddEventListenerById("edit-back-button", "click", CloseEditView);

    // get all macros from local storage
    chrome.storage.local.get(null, (result) => {
        console.log("Retrieved Macros: ", result);
        for (let key in result) {
            const macro = result[key];
            state.current_macros[key] = {...macro};
            AddNewMacro(key, macro.urls, macro.macro);
        }
    });
}

InitializePopup();

