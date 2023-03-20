class Tooltip {
  element;
  pointerController = new AbortController();

  constructor() {
    if (Tooltip.instance) return Tooltip.instance;

    Tooltip.instance = this;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<div class="tooltip"></div>`;
    this.element = wrapper.firstChild;
  }

  initialize () {
    this.initEventListeners();
  }

  render(tooltipText) {
    if (this.element) {
      this.element.textContent = `${tooltipText}`
      document.body.append(this.element);
    };
  }

  onPointerOver = event => {
    const tooltipText = event.target.dataset.tooltip;

    if (!tooltipText) return;

    this.render(tooltipText);
    this.calculatePointerCoordinates(event)
    document.body.addEventListener('pointermove', this.onPointerMove, { signal: this.pointerController.signal });
  }

  onPointerOut = () => {
    document.body.removeEventListener('pointermove', this.onPointerMove);
    if (this.element) this.remove();
  }

  onPointerMove = event => this.calculatePointerCoordinates(event);

  calculatePointerCoordinates({ clientX, clientY }) {
    this.element.style.left = `${Math.round(clientX + 10)}px`;
    this.element.style.top = `${Math.round(clientY + 10)}px`;
  }

  initEventListeners() {
    document.body.addEventListener('pointerover', this.onPointerOver, { signal: this.pointerController.signal });
    document.body.addEventListener('pointerout', this.onPointerOut, { signal: this.pointerController.signal });
  }

  removeEventListeners() {
    this.pointerController.abort();
  }

  remove() {
    if (this.element) this.element.remove();
  }

  destroy() {
    this.removeEventListeners();
    this.remove();
  }
}

export default Tooltip;
