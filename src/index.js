import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Router, Switch, Route } from 'react-router';
import thunk from 'redux-thunk';

import history from './routerHistory';

import LandingPage from './component/Pages/LandingPage';
import AnalysisPage from './component/Pages/AnalysisPage';

import reducers from './reducer';

import './styles/style.css';
import './styles/styleLeftNav.css';
import './styles/styleRightAnalysis.css';
import './styles/styleLoading.css';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <Router history={history}>
      <Switch>
        <Route exact={true} path="/" component={LandingPage}/>
        <Route exact={true} path="/analysis" component={AnalysisPage}/>
      </Switch>
    </Router>
  </Provider>
  , document.querySelector('.container'));
