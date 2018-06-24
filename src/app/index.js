import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import reducers from './reducers';

import App from './components/App';
import SynthReactor from './components/synth-reactor';
import ReactGA from 'react-ga';

import './components/bundle.scss';

const history = createBrowserHistory();
const createStoreWithMiddleware = applyMiddleware()(createStore);
const store = createStoreWithMiddleware(reducers);

ReactGA.initialize('UA-121329291-1');
ReactGA.pageview(window.location.pathname + window.location.search);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App history={history}>
        <Route exact path="/" component={SynthReactor} />
      </App>
    </Router>
  </Provider>
  , document.getElementById('react-root'));
