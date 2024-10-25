
// Key Mappings
const keyMapping = {

}


// helper functions
const FilterRepeatedKeys = (keys) => {
  return keys.filter((key, index) => keys.indexOf(key) === index);
}

const FormatKeys = (keys) => {
  keys.sort((key1, key2) => key2.length - key1.length || key2.localeCompare(key1));
}

chrome.runtime.onMessage.addListener(
    function(request, _, _) {
      if (request['from'] && request['from'] === 'content' && request['keys'])
        console.log("FROM BACKGROUND: ", request['keys']);
        const keys = FilterRepeatedKeys(request['keys']);
        FormatKeys(keys);
        console.log("FORMATTED KEYS: ", keys);
    }
  );
