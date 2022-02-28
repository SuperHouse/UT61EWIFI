import cookies from 'cookies-js';

const themes = [{
  name: 'DEFAULT',
  primary: '#502bfe',
  secondary: '#888888',
  lcd: {
    hold: 'black',
    bgAlert: 'black',
    bg: '#502bfe',
    alt: 'black',
    active: 'black',
    unit: 'black',
    range: 'black',
    text: 'black',
  }
}, {
  name: 'DARK',
  primary: '#ce1729',
  secondary: '#888888',
  lcd: {
    hold: '#ce1729',
    bgAlert: '#ce1729',
    bg: '#252525',
    alt: 'black',
    active: 'white',
    unit: 'white',
    range: 'white',
    text: 'white',
  }
}];

let activeThemeIndex = Number.parseInt(cookies.get('active-theme') || '0') || 0;

let activeTheme = themes[activeThemeIndex];

export default {
  themes,
  theme: activeTheme,
  themeIndex: activeThemeIndex,
  setTheme: (themeIndex) => {
    cookies.set('active-theme', themeIndex);
    window.location.reload();
  }
}