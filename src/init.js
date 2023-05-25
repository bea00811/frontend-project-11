// @ts-check

import Example from './Example.js';

export default () => {
  const element = document.getElementById('point2');
  const obj = new Example(element);
  obj.init();
};
