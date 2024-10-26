
// helper functions
export const FetchFromLocal = async (key) => {
    return await chrome.storage.local.get(key);
  }
  
export const SetToLocale = async (key, value) => {
  const obj = {};
  obj[key] = value;

  await chrome.storage.local.set(obj);
}

export const Log = (...others) => {
  console.log(others.join(' '));
}

const CreateTabs = (urls, active_url) => {
  urls.forEach(url => {
    chrome.tabs.create({ url: url, active: active_url && url.localeCompare(active_url)});
  });
}


export class MacroController {
  constructor(keyMapping) {
    this.keyMapping = keyMapping;
  }

  SetKeyMapping(keyMapping) {
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

  /**
 * [someFunction description]
 * @param  {[type]} arg1 [description]
 * @param  {[type]} arg2 [description]
 * @return {[type]}      [description]
 */
  ExecuteMacro(macro) {
    console.log("Executing Macro");

    if (macro && macro in this.keyMapping) {
      const active_url = this.keyMapping[macro].active_url;
      CreateTabs(this.keyMapping[macro], active_url ?  active_url : null);
    }
  }
}

