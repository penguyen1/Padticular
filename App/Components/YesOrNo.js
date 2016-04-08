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
      temp: {
        id: '',
        capacity: '',
        public_address: '',       // split(',') and get[0,1,2] only and turn to string
        property_type: '',
        pic_url: '',
        price: '' 
      },
      apartment: false, 
    }
  }

  // load first apt from this.props.apts 
  componentWillMount(){
    var first = this.props.apts.pop()
    console.log('loading up the first apartment! ', first)

  }

  // user wants to save this apt
  handleSaveApt(){    // accept AirBnB id
    console.log('You got it Boss! Saved!')
    // calls api.get
    
    // get apt id & check if it exists in Firebase /apts
        // if yes, get the apt_uid & add it into users/apts (indexOn??, key(), push(), set()????)
        // if no: 
              // add apt into apts and get its apt_uid
              // add all apt's picture_urls[max 15] into images
              // find 5 most recent crimes, check if apt_uid exists in crimes or not, add/update it with new crimes
    // go to next apt
    this.handleNextApt()
  }

  handleNextApt(){
    console.log('Next apartment coming right up!')

    // if(this.props.apts.length){
    //   return this.props.apts.pop()
    // } else{
    //   // // redirect to Homepage
    //   console.log('Uh Oh! No more apartments!')
    //   // this.props.navigator.push({
    //   //   title: 'Homepage',
    //   //   component: Homepage,
    //   //   passProps: {
    //   //     user: this.props.user
    //   //   }
    //   // })
    // }
  }

  render(){
    return(
      <View style={styles.mainContainer}>
        <Text style={styles.title}> Yeah or Nah? </Text>
        <View style={styles.formContainer}>
          <Text style={styles.listFavs}>Apts for {this.props.user.name} </Text>

          {/* Temp 'YES' Button to Save Apt */}
          <TouchableHighlight
            style={styles.button}
            onPress={this.handleSaveApt.bind(this)}
            underlayColor='white' >
            <Text style={styles.buttonText}>I WANT!</Text>
          </TouchableHighlight>

          {/* Temp 'NAHH' Button to get Next Apt */}
          <TouchableHighlight
            style={styles.button}
            onPress={this.handleNextApt.bind(this)}
            underlayColor='white' >
            <Text style={styles.buttonText}>Nah, Pass</Text>
          </TouchableHighlight>

        </View>
      </View>
    )
  }
};


YesOrNo.propTypes = {
  user: React.PropTypes.object.isRequired,
  apts: React.PropTypes.array.isRequired
};

module.exports = YesOrNo;