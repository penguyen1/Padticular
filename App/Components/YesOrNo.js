'use strict'
const React = require('react-native');
const Firebase = require('firebase');
var styles = require('./Helpers/Styles');
var Homepage = require('./Homepage');
var Search = require('./Search');
// var Nav = require('./Nav');

// hits Firebase
var ref = new Firebase('https://dazzling-inferno-3629.firebaseio.com/');
var userRef = ref.child('users/');
var aptRef = userRef.child('apts/');

// hits AirBnB API
// var api = require('../Utils/api');

var {
  Text,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS,
  StyleSheet,
  View,
  Navigator,
  ListView
} = React;

// verifies user auth state 
function authDataCallback(authData) {
  console.log( authData ? "User is logged in!" : "User is logged out!" );
}

class YesOrNo extends React.Component{

};


YesOrNo.propTypes = {
  user: React.PropTypes.object.isRequired
};

module.exports = YesOrNo;