
// helper functions
export const FetchFromLocal = async (key) => {
    return await chrome.storage.local.get([key]);
  }
  
export const SetToLocale = async (key, value) => {
  const obj = {};
  obj[key] = value;

  await chrome.storage.local.set(obj);
}

export const Log = (...others) => {
  console.log(others.join(' '));
}


export class MacroController {
  constructor(keyMapping) {
    this.keyMapping = keyMapping;
  }

  ValidKeyMapping(keys) {
    const parsed_keys = keys.join('+');
    return parsed_keys in this.keyMapping ? this.keyMapping[parsed_keys] : null;
  }

  async SaveMacro(parsed_keys, macro) {
    if (this.keyMapping[parsed_keys]) {
      // Macro already exists
      alert("Macro already exist. Would you like to overwrite it?");
      return
    }

    this.keyMapping[parsed_keys] = macro;
    await SetToLocale('macros', this.keyMapping);
  }

  async DeleteMacro(parsed_keys) {
    if (!this.keyMapping[parsed_keys]) return;

    delete this.keyMapping[parsed_keys];
    await SetToLocale('macros', this.keyMapping)
  }

  ExecuteMacro(macro) {
    // Execute the macro
    console.log("Executing Macro: ", macro);
  }
}

