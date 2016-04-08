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
        person_capacity: '',        // render
        picture_urls: [],           // render
        property_type: '',          // render
        address: '',
        price_formatted: '',        // render
        smart_location: '',         // render
        min_nights: '',
        map_image_url: '',
        summary: '',
      }
    };
    this.aptRef = new Firebase('https://dazzling-inferno-3629.firebaseio.com/apts');
    this.userRef = new Firebase('https://dazzling-inferno-3629.firebaseio.com/users');
    this.apt_uid = '';
  }

  // gets first apt from this.props.apts 
  componentWillMount(){
    this.handleNextApt()
  }

  // user wants to save this apt
  handleSaveApt(){    // accept AirBnB id
    console.log('You got it Boss! Saving Apt: ', this.state.apt)
    

    // testing #1
    // if(this.aptRef.exists()){
    //   // if(aptRef.has)
    //   console.log('apartment exists!')
    //   // aptRef.orderByChild('id').equalTo(this.state.apt.id).on('child_added', (snap)=>{
    //   //   console.log(snap.key())
    //   // })
    // } else {
      // apt does not yet exist 
      // console.log('apartment does not exist!')
      console.log('pushing apt to users')
      var newApt = this.aptRef.push({ 
        id: this.state.apt.id,
        bedrooms: this.state.apt.bedrooms,
        bathrooms: this.state.apt.bathrooms,
        beds: this.state.apt.beds,
        lat: this.state.apt.lat,
        lng: this.state.apt.lng,
        person_capacity: this.state.apt.person_capacity,
        picture_urls: this.state.apt.picture_urls,   
        property_type: this.state.apt.property_type,  
        address: this.state.apt.address,
        price_formatted: this.state.apt.price_formatted,
        smart_location: this.state.apt.smart_location, 
        min_nights: this.state.apt.min_nights,
        map_image_url: this.state.apt.map_image_url,
        summary: this.state.apt.summary
      })

      // get new apt uid 
      var apt_uid = newApt.key()
      console.log('this.apt_uid: ', apt_uid)
      this.userRef.child(this.props.user.uid).child('/apts').child(apt_uid).set(true)
      // console.log('new apartment key: ', newApt_key)
      // console.log('user uid: ', this.props.user.uid)
    // }
    
    // 1. get apt id & check if id exists in Firebase /apts
        // a. if yes, get the apt_uid & add it into users/apts (indexOn??, key(), push(), set()????)
        // b. if no: 
              // i - add apt into apts and get its apt_uid
              // ii - add all apt's picture_urls[max 15] into images
              // iii - find 5 most recent crimes, check if apt_uid exists in crimes or not, add/update it with new crimes
    // 2. go to next apt
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
        <View style={styles.formContainer}>
          <Text style={styles.listFavs}>Apts for {this.props.user.name} </Text>
          <Text style={styles.listFavs}>Images: {this.state.apt.picture_urls[0]} </Text>
          <Text style={styles.listFavs}>{this.state.apt.price_formatted} per night</Text>
          <Text style={styles.listFavs}>{this.state.apt.property_type} | </Text>
          <Text style={styles.listFavs}>{this.state.apt.smart_location}</Text>
          <Text style={styles.listFavs}>Fits: {this.state.apt.person_capacity} </Text>
          <Text style={styles.listFavs}>Min nights: {this.state.apt.min_nights} </Text>

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