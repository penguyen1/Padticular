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
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      capacity: '',
      public_address: '',       // split(',') and get[0,1,2] only and turn to string
      property_type: '',
      pic_url: '',
      price: ''  
    };
  }

  // load first listing in this.props.apts
  componentWillMount(){
    console.log('loading up the first apartment! ', this.props.apts[0])
  }

  // user wants to save this apt
  handleSaveApt(){
    // get apt id & check if it exists in Firebase /apts
        // if yes, get the apt_uid & add it into users/apts (indexOn??, key(), push(), set()????)
        // if no: 
              // add apt into apts and get its apt_uid
              // add all apt's picture_urls[max 15] into images
              // find 5 most recent crimes, check if apt_uid exists in crimes or not, add/update it with new crimes
    // go to next apt
  }

  handleNextApt(){
    if(this.props.apts.length){
      return this.props.apts.pop()
    } else{
      // // redirect to Homepage
      console.log('Uh Oh! No more apartments!')
      // this.props.navigator.push({
      //   title: 'Homepage',
      //   component: Homepage,
      //   passProps: {
      //     user: this.props.user
      //   }
      // })
    }
  }







};


YesOrNo.propTypes = {
  user: React.PropTypes.object.isRequired,
  apts: React.PropTypes.array.isRequired
};

module.exports = YesOrNo;