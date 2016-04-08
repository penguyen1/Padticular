'use strict'
const React = require('react-native');
const Firebase = require('firebase');
var api = require('../Utils/api');
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
      apt: {
        id: '',
        bedrooms: '',
        bathrooms: '',
        beds: '',
        lat: '',
        lng: '',
        person_capacity: '',
        picture_urls: [],
        property_type: '',
        address: '',
        price_formatted: '',
        smart_location: '',
        min_nights: '',
        map_image_url: '',
        summary: '',
      },
    }
  }

  // gets first apt from this.props.apts 
  componentWillMount(){
    this.handleNextApt()
  }

  // user wants to save this apt
  handleSaveApt(){    // accept AirBnB id
    
    console.log('You got it Boss! Saving Apt')
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

  // gets next apartment
  handleNextApt(){
    console.log('Apartments left: ', this.props.apts.length)
    // are there any apartments left in this.props.apts?
    if(this.props.apts.length){

      var next = this.props.apts.pop()
      console.log('NEXT Apartment ID: ', next)

      // call getApartmentInfo in api.js & get back a response
      api.getApartmentInfo(next)
        .then((res) => {
          // saves specific info in res to this.state.apt keys
          Object.keys(this.state.apt).forEach((key)=>{
            // console.log('Key is: ', key)
            this.state.apt[key] = res.listing[key]
          })
          this.setState({ apt: this.state.apt })
          console.log('current YesOrNo setState: ', this.state.apt)
          // render it

        }).catch((err)=>console.log('ERROR getting Apartment Info: ',err))

    } else {    // no more apartments left!
      // // redirect to Homepage
      console.log('Uh Oh! No more apartments!')
      this.props.navigator.push({
        title: 'Homepage',
        component: Homepage,
        passProps: {
          user: this.props.user
        }
      })
    }
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