// The structure of this project is loosely based upon the webpack tutorial code
// https://github.com/marionettejs/marionette-integrations/tree/master/webpack 
import './styles/application.scss';
import App from './components/App.js';

// When the page has loaded, we start the app
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.start();
});
