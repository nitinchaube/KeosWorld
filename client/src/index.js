import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router-dom";
import "antd/dist/antd.css";

//Redux
import {createStore} from "redux";
import {Provider} from "react-redux";
import {composeWithDevTools} from 'redux-devtools-extension';
import rootReducer from "./reducers";
import ScrollToTop from './ScrollToTop';


//Store
const store= createStore(rootReducer, composeWithDevTools());


ReactDOM.render(
  //<React.StrictMode>    // lots of warning are coming because of this as many packages does not support strictmode
  <Provider store={store}>
    <BrowserRouter >
      <ScrollToTop/>
      <App/>
      
    </BrowserRouter>
  </Provider>,
    
  //</React.StrictMode>,
  document.getElementById('root')
);


reportWebVitals();
