// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap's JS
//  import * as bootstrap from 'bootstrap'

//  import Alert from 'bootstrap/js/dist/alert'

//  // or, specify which plugins you need:
  import Accordion from 'bootstrap'


document.querySelector('.mybtn').addEventListener('click', function (event) {
    console.log('Произошло событие', event.type);
    
  })
