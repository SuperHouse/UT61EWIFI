import cookies from 'cookies-js';

const pages = [{
  name: 'LCD',
  pages: ['lcd']
}, {
  name: 'GRAPH',
  pages: ['graph']
}, {
  name: 'LCD+GRAPH',
  pages: ['lcd','graph']
}];

let activePageIndex = Number.parseInt(cookies.get('active-page') || '0') || 0;

export default {
  pages,
  page: pages[activePageIndex],
  pageIndex: activePageIndex,
  setPage: (pageIndex) => {
    cookies.set('active-page', pageIndex);
    window.location.reload();
  }
}