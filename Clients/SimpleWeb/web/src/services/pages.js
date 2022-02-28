import cookies from './storage'

const pages = [{
  name: 'LCD',
  pages: ['lcd']
}, {
  name: 'GRAPH',
  pages: ['graph']
}, {
  name: 'LCD+GRAPH',
  pages: ['lcd', 'graph']
}];

let activePageIndex = Number.parseInt(cookies.get('active-page') || '0') || 0;

let activePage = pages[activePageIndex];
if (activePage === undefined || activePage === null) {
  activePage = pages[0];
  activePageIndex = 0;
}
cookies.set('active-page', activePageIndex);

export default {
  pages,
  page: activePage,
  pageIndex: activePageIndex,
  setPage: (pageIndex) => {
    cookies.set('active-page', pageIndex);
    window.location.reload();
  }
}