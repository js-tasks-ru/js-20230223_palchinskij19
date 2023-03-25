import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
   chartHeight = 50;
   subElements;

   constructor({
      data = [],
      label = '',
      formatHeading = data => data,
      link = '',
      range = {
         from: new Date(),
         to: new Date(),
      },
      url = '',
   } = {}) {
      this.data = data;
      this.label = label;
      this.link = link;
      this.range = range;
      this.url = new URL(url, BACKEND_URL);
      this.formatHeading = formatHeading;

      this.render();
      this.update(
         this.range.from,
         this.range.to
      );
   }

   getColumnProps() {
      const maxValue = Math.max(...this.data);
      const scale = this.chartHeight / maxValue;

      return this.data.map(item => {
        return {
          percent: (item / maxValue * 100).toFixed(0) + '%',
          value: String(Math.floor(item * scale))
        };
      });
   }

   getLoadingStatus() {
      return !this?.data.length ? 'column-chart_loading' : '';
   }

   getLink() {
      return this.link ? `<a href="${this.link}" class="column-chart__link">View all</a>` : '';
   }

   getListElements() {
      return this.getColumnProps().map(column => 
            `<div style="--value:${column.value}" data-tooltip="${column.percent}"></div>`
      ).join('');
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

   getTemplate() {
      return `
      <div class="column-chart ${this.getLoadingStatus()}" style="--chart-height: ${this.chartHeight}">
         <div class="column-chart__title">
            Total ${this.label}
            ${this.getLink()}
         </div>
         <div class="column-chart__container">
            <div data-element="header" class="column-chart__header"></div>
            <div data-element="body" class="column-chart__chart">${this.getListElements()}</div>
         </div>
      </div>
   `;
   }

   remove() {
      if (this.element) {
         this.element.remove();
       }
    }
  
   destroy() {
      this.remove();
      this.element = null;
      this.subElements = null;
   }

   async loadData(from, to) {
      try {
         this.url.searchParams.set('from', from);
         this.url.searchParams.set('to', to);
         const response = await fetchJson(this.url);
         return response;
      } catch (error) {
         console.error(`loadData error: ${error}`);
      }
   }

   async update(from, to) {
      const loadedData = await this.loadData(from, to);
      this.element.classList.remove("column-chart_loading");
      this.data = Object.values(loadedData);
      const itemCount = this.data.reduce((acc, val) => acc + val).toString();
      this.subElements.body.innerHTML = this.getListElements();
      this.subElements.header.innerText = this.formatHeading(new Intl.NumberFormat('en-US').format(itemCount));

      return loadedData;
   }

   render () {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = this.getTemplate();
      this.element = wrapper.firstElementChild;
      this.subElements = this.getSubelements();
   }
}
