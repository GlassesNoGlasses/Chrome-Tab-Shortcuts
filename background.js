
import { FetchFromLocal, Log, MacroController } from "./helper.js";

// Variables
let macroController;

// helper functions
const FilterKeys = (keys) => {
  return keys.filter((key, index) => keys.indexOf(key) === index && key.length < 6);
}

const FormatKeys = (keys) => {
  keys.sort((key1, key2) => key2.length - key1.length || key2.localeCompare(key1));
}


// main functions
const StartUp = () => {
  // Fetch keyMapping from local storage
  (async () => {
    // format of storage {'macros': {'key1+key2': 'macro1', 'key3+key4': 'macro2'}}
    const keys = await FetchFromLocal('macros');
    Log("Background Fetched:", keys, "from local storage");
    if (keys) macroController = new MacroController(keys);
  })();



  // Listen for changes in keyMapping
}

// StartUp Background
StartUp();


// Listeners
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request['from'] && request['from'] === 'content' && request['keys'])
        console.log("FROM BACKGROUND: ", request['keys']);
        const keys = FilterKeys(request['keys']);
        FormatKeys(keys);
        console.log("FORMATTED KEYS: ", keys);
        const macroTabs = macroController.ValidKeyMapping(keys);
        console.log("MACRO: ", macroTabs);
    }
);
