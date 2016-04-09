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
      },
      reset: false,
    };
    this.aptRef = new Firebase('https://dazzling-inferno-3629.firebaseio.com/apts');
    this.userRef = new Firebase('https://dazzling-inferno-3629.firebaseio.com/users');
  }

  // gets first apt from this.props.apts 
  componentWillMount(){
    this.handleNextApt()
  }

  // user wants to save apt -- this.state.apt
  handleSaveApt(){
    console.log('You got it Boss! Saving Apt: ', this.state.apt)
    // TODO: check if this.state.apt.id exists in Firebase /apts -- orderByChild('id').equalTo(id) ???
    // TODO: if yes, get the apt_uid & add it into users/apts (indexOn??, key(), push(), set()????)
    
    // add apt into apts
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

    // sets reset to true -- to be reset state in Homepage
    this.state.reset = true

    // adds apt_uid to '.../users/user_uid/apts'
    this.userRef.child(`${this.props.user.uid}/apts/${newApt.key()}`).set(true)

    // BONUS: add all apt's picture_urls[] into images
    // TOTO: find 5 most recent crimes, check if apt_uid exists in crimes, push/update with new crimes

    this.handleNextApt()
  }

  // gets next apartment
  handleNextApt(){
    console.log('Apartments left: ', this.props.apts.length)
    // are there any apartments left in this.props.apts?
    if(this.props.apts.length){

      var next = this.props.apts.pop()
      // call getApartmentInfo in api.js & get back a response
      api.getApartmentInfo(next)
        .then((res) => {
          // saves specific info in res to this.state.apt keys
          Object.keys(this.state.apt).forEach((key)=>{
            this.state.apt[key] = res.listing[key]
          })
          this.setState({ apt: this.state.apt })
          // now render it!
        }).catch((err)=>console.log('ERROR getting Apartment Info: ',err))

    } else {    // no more apartments left!
      // redirect to Homepage
      var home = this.props.homepage
      // this.props.navigator.popToRoute({
      //   title: 'Homepage',
      //   component: home,
      //   reset: this.state.reset
      // })
      this.props.navigator.popToRoute(home)
    }
  }

  // componentWillUnmount(){
    
  //   this.props.reset()
  //   this.props.navigator.popToRoute(home)
  // }

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
  apts: React.PropTypes.array.isRequired,
  homepage: React.PropTypes.object.isRequired,
};

module.exports = YesOrNo;