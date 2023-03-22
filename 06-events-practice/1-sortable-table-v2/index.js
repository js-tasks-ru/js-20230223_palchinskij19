export default class SortableTable {
  element;
  subElement;

  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}) {
    this.headerConfig = headersConfig;
    this.data = data;
    this.sorted = sorted;

    this.render();
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
  const { id, order } = this.sorted;
  const sortedData = this.getSortedData(id, order);
  return `
  <div data-element="body" class="sortable-table__body">
    ${this.getTableRows(sortedData)}
  </div>
  `;
 }

  getTemplate() {
    return `
      <div data-element="productsContainer" className="products-list__container">
        <div className="sortable-table">
          ${this.getTableHeader()}
          ${this.getTableBody()}
        </div>
      </div>
    `;
  }

  getSortedData(field, order) {
    const dataArr = [...this.data];
    
    const column = this.headerConfig.find(item => item.id == field);
    
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

  sort = (event) => {
    const currentColumn = event.target.closest('.sortable-table__cell');
    
    if (!currentColumn || !currentColumn.dataset.sortable) return;

    const field = currentColumn.dataset.id;
    const order = currentColumn.dataset.order === 'desc' ? 'asc' : 'desc';
    const sortedData = this.getSortedData(field, order);
    const columns = this.element.querySelectorAll('.sortable-table__cell[data-id]');

    columns.forEach(column => {
      column.dataset.order = '';
    });

    currentColumn.dataset.order = order;
    this.subElements.body.innerHTML = this.getTableRows(sortedData);
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTemplate();
    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubelements();
    this.initEventListeners();
  }

  initEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.sort);
  }

  removeEventListeners() {
    this.subElements?.header.removeEventListener('pointerdown', this.sort);
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
