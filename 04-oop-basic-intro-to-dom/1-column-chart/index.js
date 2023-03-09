export default class ColumnChart {
   constructor({
      data = [],
      label = '',
      value = '',
      formatHeading = () => this.value,
      link = '',
   } = {}) {
      this.data = data;
      this.label = label;
      this.value = value;
      this.formatHeading = () => formatHeading(new Intl.NumberFormat('en-US').format(this.value));
      this.link = link;
      this.chartHeight = 50;

      this.render();
   }

   _getColumnProps() {
      const maxValue = Math.max(...this.data);
      const scale = 50 / maxValue;
    
      return this.data.map(item => {
        return {
          percent: (item / maxValue * 100).toFixed(0) + '%',
          value: String(Math.floor(item * scale))
        };
      });
   }

   _getLoadingStatus() {
      return !this?.data.length ? 'column-chart_loading' : '';
   }

   _getLink() {
      return this.link ? `<a href="${this.link}" class="column-chart__link">View all</a>` : '';
   }

   _getListElements() {
      return this._getColumnProps().map(column => 
            `<div style="--value:${column.value}" data-tooltip="${column.percent}"></div>`
      ).join('');
   }

   _getTemplate() {
      return `
      <div class="column-chart ${this._getLoadingStatus()}" style="--chart-height: ${this.chartHeight}">
         <div class="column-chart__title">
            Total ${this.label}
            ${this._getLink()}
         </div>
         <div class="column-chart__container">
            <div data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>
            <div data-element="body" class="column-chart__chart">${this._getListElements()}</div>
         </div>
      </div>
   `;
   }

   remove() {
      this.element.remove();
    }
  
   destroy() {
      this.remove();
   }

   update(newData) {
      this.data = newData;
      this.render();

      return this.element; 
   }

   render () {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = this._getTemplate();

      this.element = wrapper.firstElementChild;
   }
}
