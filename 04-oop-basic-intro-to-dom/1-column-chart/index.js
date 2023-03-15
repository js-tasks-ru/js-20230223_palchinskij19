export default class ColumnChart {
   chartHeight = 50;
   subElements;

   constructor({
      data = [],
      label = '',
      value = '',
      formatHeading = data => data,
      link = '',
   } = {}) {
      this.data = data;
      this.label = label;
      this.value = () => formatHeading(new Intl.NumberFormat('en-US').format(value));
      this.formatHeading = () => formatHeading(new Intl.NumberFormat('en-US').format(this.value));
      this.link = link;

      this.render();
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
            <div data-element="header" class="column-chart__header">${this.value}</div>
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
      this.element = {};
      this.subElements = {};
   }

   update(data = []) {
      this.data = data;
      this.subElements.body.innerHTML = this.getListElements();
   }

   render () {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = this.getTemplate();
      this.element = wrapper.firstElementChild;
      this.subElements = this.getSubelements();
   }
}
