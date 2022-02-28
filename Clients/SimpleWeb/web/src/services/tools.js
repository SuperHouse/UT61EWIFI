const knownProps = ['page', 'wsserver'];
const defaults = {
  page: 'lcd'
};
import cookies from './storage';
const tools = {
  resetSession() {
    cookies.expire("active-server");
    cookies.expire("active-theme");
    window.location.reload(true);
  },
  forceNavigate(props = {}) {
    let pageObjs = {};
    for (let prop of knownProps) {
      pageObjs[prop] = tools.getParameterByName(prop);
    }
    for (let prop of Object.keys(props)) {
      pageObjs[prop] = props[prop];
    }
    let pageLocal = [];
    for (let prop of knownProps) {
      let encoded = `${encodeURIComponent(pageObjs[prop]) || ''}`;
      if (encoded !== '' && `${encoded}` !== 'null')
        pageLocal.push(`${prop}=${encoded}`);
    }
    let newLocal = `${window.location.origin}${window.location.pathname}?${pageLocal.join('&')}`;
    console.log(`${window.location.href} != ${newLocal}`)
    if (window.location.href != newLocal)
      window.location = newLocal;
  },
  getParameterByName: (name, url = window.location.href) => {
    name = name.replace(/[\[\]]/g, '\\$&'); // eslint-disable-line
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return defaults[name] || null;
    if (!results[2]) return defaults[name] || null;
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
};
export default tools;