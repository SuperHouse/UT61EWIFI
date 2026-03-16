export default {
  set(name, value) {
    window.localStorage.setItem(name, value);
  },
  get(name) {
    let val = window.localStorage.getItem(name);
    if (val === undefined || val === null) {
      return null;
    }
    return val;
  },
  expire(name) {
    window.localStorage.removeItem(name);
  }
}