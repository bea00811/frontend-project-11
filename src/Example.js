// @ts-check

export default class Example {
  constructor(element) {
    this.element = element;
  }

  init() {
    this.element.textContent = 'This is text from example.js (function init)';
    console.log('ehu!');
  }
}
