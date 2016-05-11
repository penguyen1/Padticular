// *** ATTENTION!! *** The code found in this index.ios.js file is credited to 
// Pavel Aksonov's React-Native-Redux-Router sample code: https://github.com/aksonov/react-native-redux-router

'use strict'
import React, {Component} from 'react';
import { AppRegistry, StyleSheet, Text, View } from 'react-native';
import { Animations, Container, Route, Router, routerReducer, Schema } from 'react-native-redux-router';

// Padticular 2 components
// var Error     = require('./components/Error');
// var Homepage  = require('./components/Homepage');
var Intro     = require('./components/Intro');
// var Login     = require('./components/Login');
// var Profile   = require('./components/Profile');
// var Search    = require('./components/Search');
// var Signup    = require('./components/Signup');
// var YesOrNo   = require('./components/YesOrNo');
// var { NavBar, NavBarModal } = require('./components/NavBar');

// Redux modules 
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createLogger from 'redux-logger';

const loggerMiddleWare = createLogger();
const createStoreWithMiddleware = applyMiddleware(loggerMiddleWare)(createStore);
const reducer = combineReducers({routerReducer});
let store = createStoreWithMiddleware(reducer);


// Initialization of all Padticular2 routes
class App extends Component {
  render() {
    return (
      <View style={{ flex:1 }}>
        <View style={{ position:'absolute', left:0, right:0, top:0, bottom:0, backgroundColor:'#F5FCFF' }} />
        <Router>
          <Schema name="modal" sceneConfig={Animations.FlatFloatFromBottom} navBar={NavBarModal} />
          <Schema name="default" sceneConfig={Animations.FlatFloatFromRight} navBar={NavBar} />
          <Schema name="noAnimation" navBar={NavBar} />
          <Schema name="tab" navBar={NavBar} />

          <Route name="intro" component={Intro} initial={true} hideNavBar={true} title="Launch" />
        </Router>
      </View>
    );
  }
}

// Original Version
// class App extends React.Component {
//   render() {
//     return (
//       <View style={{ flex:1 }}>
//         <View style={{ position:'absolute', left:0, right:0, top:0, bottom:0, backgroundColor:'#F5FCFF' }} />
//         <Router>
//           <Schema name="modal" sceneConfig={Animations.FlatFloatFromBottom} navBar={NavBarModal} />
//           <Schema name="default" sceneConfig={Animations.FlatFloatFromRight} navBar={NavBar} />
//           <Schema name="noAnimation" navBar={NavBar} />
//           <Schema name="tab" navBar={NavBar} />

//           <Route name="intro" component={Intro} initial={true} hideNavBar={true} title="Launch" />
//           <Route name="signup" component={Signup} title="New User Registration" schema="modal" />
//           <Route name="login" component={Login} title="Log In Page" schema="modal" />
//           <Route name="homepage" component={Homepage} title="User Homepage" type="replace" />
//           <Route name="search" component={Search} title="Padticular Search" schema="modal" />
//           <Route name="yesorno" component={YesOrNo} title="YesOrNo" schema="noAnimation" />
//           <Route name="profile" component={Profile} title="Apartment Profile" schema="noAnimation" />
//           <Route name="error" component={Error} schema="popup" />
//         </Router>
//       </View>
//     )
//   }
// }

class Padticular2 extends Component {
  render() {
    return (
      <Provider store={store}>
        {() => <App />}
      </Provider>
    );
  }
}

AppRegistry.registerComponent('Padticular2', () => Padticular2);

