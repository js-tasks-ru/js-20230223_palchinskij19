import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  element;
  subElements;
  sortableController = new AbortController();
  step = 30;
  start = 1;
  end = this.start + this.step;
  loadign = false;

  constructor(headersConfig, {
    url = '',
    data = [],
    sorted = {
      id: headersConfig.find(item => item.sortable).id,
      order: 'asc'
    },
    isSortLocally = false,
  } = {}) {
    this.headerConfig = headersConfig;
    this.sorted = sorted;
    this.url = new URL(url, BACKEND_URL);
    this.isSortLocally = isSortLocally;
    this.data = data;

    this.render();

    if (!this.isSortLocally) {
      this.update();
    }
  }

  sortOnClient (id, order) {
    const column = this.headerConfig.find(item => item.id == id);
    const dataArr = [...this.data];
        
    const { sortType } = column;
    const orders = {
      asc: 1,
      desc: -1,
    };

    return dataArr.sort((firstItem, secodItem) => {
      if (sortType === 'number') {
        return orders[order] * (firstItem[field] - secodItem[field]);
      }

      if (sortType === 'string') {
        return orders[order] * firstItem[field].localeCompare(secodItem[field], ['ru', 'en']);
      }
    });
  }

  async sortOnServer (id, order) {
    return await this.loadData(id, order, this.start, this.end);;
  }

  async loadData(id, order, start = this.start, end = this.end) {
    this.url.searchParams.set('_sort', id);
    this.url.searchParams.set('_order', order);
    this.url.searchParams.set('_start', start);
    this.url.searchParams.set('_end', end);

    this.element.classList.add('sortable-table_loading');
    const data = await fetchJson(this.url); 
    this.element.classList.remove('sortable-table_loading');

    return data;
  }

  getSubelements() {
    const result = {};
    const elements = this.element.querySelectorAll('[data-element]');
    
    for (const element of elements) {
       const name = element.dataset.element;
       result[name] = element;
    }

    return result;
 }
 
 getHeaderRow({sortable, title, id}) {
  return `
    <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
      <span>${title}</span>
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    </div>
  `;
 }

 getTableHeader() {
  return `
    <div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.headerConfig.map(item => this.getHeaderRow(item)).join('')}
    </div>
  `;
 }

 getTableRow(item) {
    return this.headerConfig.map(({id,  template}) => {
      return template 
        ? template(item[id])
        : `<div class="sortable-table__cell">${item[id]}</div>`;
    }).join('');
 }

 getTableRows(data = []) {
    return data.map(item => {
      return `
        <a href="/products/${item.id}" class="sortable-table__row">
          ${this.getTableRow(item)}
        </a> 
      `;
    }).join('');
 }

 getTableBody() {
  return `
    <div data-element="body" class="sortable-table__body">
      ${this.getTableRows()}
    </div>
  `;
 }

  getTemplate() {
    return `
    <div class="sortable-table">
      ${this.getTableHeader()}
      ${this.getTableBody()}
      <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
      <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
        No products
      </div>
    </div>  
    `;
  }

   sortOnClick = async (event) => {
    const currentColumn = event.target.closest('.sortable-table__cell');

    if (!currentColumn || !currentColumn.dataset.sortable) return;

    const id = currentColumn.dataset.id;
    const order = currentColumn.dataset.order === 'desc' ? 'asc' : 'desc';
    let sortedData = [];

    if (this.isSortLocally) {
      sortedData = this.sortOnClient(id, order);
    } else {
      sortedData = await this.sortOnServer(id, order);
    }

    const columns = this.element.querySelectorAll('.sortable-table__cell[data-id]');

    columns.forEach(column => {
      column.dataset.order = '';
    });

    currentColumn.dataset.order = order;
    this.subElements.body.innerHTML = this.getTableRows(sortedData);
  }

  onWindowScroll = async () => {
    const { bottom } = this.element.getBoundingClientRect();
    const { id, order } = this.sorted;

    if (bottom < document.documentElement.clientHeight && !this.loading && !this.isSortLocally) {
      this.start = this.end;
      this.end = this.start + this.step;
      this.loading = true;
      const data = await this.loadData(id, order, this.start, this.end);
      this.update(data);
      this.loading = false;
    }
  };

  renderRows(data) {
    if (data.length) {
      this.element.classList.remove('sortable-table_empty');
      this.subElements.body.innerHTML = this.getTableRows(data);
    } else {
      this.element.classList.add('sortable-table_empty');
    }
  }

  async render() {
    const { id, order } = this.sorted;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTemplate();
    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubelements();
    const sortedData = this.sortOnClient(id, order);
    this.renderRows(sortedData);
    this.initEventListeners();
  }

  async update(scrollData = []) {
    if (scrollData.length) {
      const newRaws = document.createElement('div');
      newRaws.innerHTML = this.getTableRows(scrollData);
      this.subElements.body.append(...newRaws.children);
    } else {
      const { id, order } = this.sorted;
      const currentColumn = this.subElements.header.querySelector(`[data-id="${id}"]`);
      currentColumn.dataset.order = order;
      const sortedData = await this.sortOnServer(id, order);
      this.renderRows(sortedData);
    }
  }

  initEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.sortOnClick, { signal: this.sortableController.signal });
    window.addEventListener('scroll', this.onWindowScroll, { signal: this.sortableController.signal });
  }

  removeEventListeners() {
    this.sortableController.abort();
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
 } 
 
 destroy() {
    this.remove();
    this.removeEventListeners();
    this.element = null;
    this.subElements = null;
 }
}
