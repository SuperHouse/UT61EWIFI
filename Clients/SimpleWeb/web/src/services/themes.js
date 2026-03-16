import cookies from './storage';

const themes = [{
  name: 'Default UI',
  className: 'theme-default',
  chartColour: 'red',
}, {
  name: 'Contrast UI',
  className: 'theme-contrast',
  chartColour: 'red',
}];

let activeThemeIndex = Number.parseInt(cookies.get('active-theme') || '0') || 0;
let activeTheme = themes[activeThemeIndex];

export default {
  themes,
  theme: activeTheme,
  themeIndex: activeThemeIndex,
  setTheme: (themeIndex) => {
    cookies.set('active-theme', themeIndex);

    // TODO: get this to update the global properties so it works automatically
    document.querySelector('.wrapper').className = 'wrapper ' + themes[themeIndex].className;
    document.querySelector('.toggle-theme').innerHTML = themes[themeIndex].name;
  }
}