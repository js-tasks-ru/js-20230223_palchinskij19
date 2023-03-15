export default class NotificationMessage {
   static currentElement;
   element;
   timerId;

   constructor(title = '', {
      duration = 0,
      type = ''
   } = {}) {
      this.title = title;
      this.duration = duration;
      this.type = type;

      this.render();
   }

   getTemplate() {
      return `
      <div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
         <div class="timer"></div>
         <div class="inner-wrapper">
            <div class="notification-header">${this.type}</div>
            <div class="notification-body">
               ${this.title}
            </div>
         </div>
      </div>
      `
   }

   render() {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = this.getTemplate();
      this.element = wrapper.firstElementChild;
   }

   remove() {
      clearTimeout(this.timerId);

      if (this.element) {
        this.element.remove();
      }
   } 
   
   destroy() {
      this.remove();
      this.element = null;
      NotificationMessage.currentElement = null;
   }

   show(target = document.body) {
      if (NotificationMessage.currentElement) {
         NotificationMessage.currentElement.destroy();
      }

      target.append(this.element);
      NotificationMessage.currentElement = this;
      this.timerId = setTimeout(() => this.destroy(), this.duration);
   }
}
