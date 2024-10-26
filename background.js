
import { FetchFromLocal, Log, MacroController, SetToLocale } from "./helper.js";

// Variables
let macroController = new MacroController({});

// helper functions
const FilterKeys = (keys) => {
  return keys.filter((key, index) => keys.indexOf(key) === index && key.length < 6);
}

const FormatKeys = (keys) => {
  keys.sort((key1, key2) => key2.length - key1.length || key2.localeCompare(key1));
}

// testing functions
const ResetLocalStorage = () => {
  chrome.storage.local.clear();
}

const PopulateLocalStorage = async () => {
  // storage format: {macro: {urls: [url1, url2, ...], active_url: url2}}
  await SetToLocale('shift+2', {urls: ['https://www.facebook.com', 'https://www.youtube.com'], active_url: "https://www.youtube.com"});
}

// main functions
const StartUp = async () => {
  ResetLocalStorage();
  await PopulateLocalStorage();

  
  const keys = await FetchFromLocal(null);
  console.log("Fetched From Local: ", keys);
  if (keys) macroController.SetKeyMapping(keys);
  console.log("Setted to Controller: ", macroController.keyMapping);
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

// Listen for changes and ensure changes are valid
// chrome.storage.onChanged.addListener((changes) => {
//   for (let storage_key in changes) {
//     if (storage_key === 'macros') {
//       for (let key in changes[storage_key].newValue) {
//         if (! key in macroController.keyMapping || )
//       }
//     }
//   }
// })
