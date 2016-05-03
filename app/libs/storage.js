export default {
  // localStorage has the following API:
  //  - getItem(k) - returns stored value for key
  //  - removeItem(k) - removes data matching key
  //  - setItem(k, v) - sets the value for given key
  //  - clear() - Empties storage

  get(k) {
    try { 
      return JSON.parse(localStorage.getItem(k));
    } 
    catch(e) {
      return null;
    }
  },

  set(k, v) {
    // 
    localStorage.setItem(k, JSON.stringify(v));
  }

};