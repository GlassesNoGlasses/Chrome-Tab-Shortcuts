
// state variables
let state = {
    // set state variables here
    add_macro_form: false, // true if add macro form is visible
}

// helper functions
const UpdateElementDisplay = (element, display) => {
    if (!element) {
        return;
    }

    element.style.display = display;
}

const SaveMacro = (name, urls, key_macro) => {
    try {
        if (!name || !urls || !key_macro) {
            alert("Please fill out all fields");
        };
        // TODO: save macro to chrome storage
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

}

// activates on popup.html load



// handle onClick listeners
document.getElementById("add-macro-shortcut").addEventListener("click", () => ToggleMacroForm());

