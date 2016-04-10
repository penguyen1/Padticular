                                            

                                            /*** ATTENTION!! ***/ 
/** CREDIT: some of the code was copied from GitHub/brentvatne for react-native-animated-tinder swipe animation  **/
/** FOLLOWING METHODS WERE COPIED: componentDidMount, _animateEntrance, componentWillMount, _resetState & render **/
/** LINK:   https://github.com/brentvatne/react-native-animated-demo-tinder/blob/master/index.ios.js             **/

'use strict'
const React = require('react-native');
const Firebase = require('firebase');
const SwipeCards = require('react-native-swipe-cards');
var api = require('../Utils/api');
var clamp = require('clamp');
// var styles = require('./Helpers/Styles');
var Homepage = require('./Homepage');
var Defaults = require('./Helpers/Defaults');
// var Nav = require('./Nav');
var ref = new Firebase('https://dazzling-inferno-3629.firebaseio.com/');
var SWIPE_THRESHOLD = 120;

var {
  ActivityIndicatorIOS,
  Animated,
  Component,
  Image,
  ListView,
  Navigator,
  PanResponder,
  Text,
  TextInput,
  TouchableHighlight,
  StyleSheet,
  View,
} = React;

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
      pan: new Animated.ValueXY(),
      enter: new Animated.Value(0.5),
    };
    this.aptRef = new Firebase('https://dazzling-inferno-3629.firebaseio.com/apts');
    this.userRef = new Firebase('https://dazzling-inferno-3629.firebaseio.com/users');
  }

  // gets first apt from this.props.apts ???
  componentWillMount() {
    // this.handleNextApt()
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderGrant: (e, gestureState) => {
        this.state.pan.setOffset({x: this.state.pan.x._value, y: this.state.pan.y._value});
        this.state.pan.setValue({x: 0, y: 0});
      },

      onPanResponderMove: Animated.event([
        null, {dx: this.state.pan.x, dy: this.state.pan.y},
      ]),

      onPanResponderRelease: (e, {vx, vy}) => {
        this.state.pan.flattenOffset();
        var velocity;

        if (vx >= 0) {
          velocity = clamp(vx, 3, 5);
        } else if (vx < 0) {
          velocity = clamp(vx * -1, 3, 5) * -1;
        }

        if (Math.abs(this.state.pan.x._value) > SWIPE_THRESHOLD) {
          Animated.decay(this.state.pan, {
            velocity: {x: velocity, y: vy},
            deceleration: 0.98
          }).start(this._resetState)
        } else {
          Animated.spring(this.state.pan, {
            toValue: {x: 0, y: 0},
            friction: 4
          }).start()
        }
      }
    })
  }

  // performs before rendering to Homepage
  componentWillUnmount(){
    console.log('unmounting YesOrNo')
    ref.off()
  }

  componentDidMount() {
    this._animateEntrance();
  }

  _animateEntrance() {
    Animated.spring(
      this.state.enter,
      { toValue: 1, friction: 8 }
    ).start();
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

    // adds apt_uid to '.../users/user_uid/apts'
    this.userRef.child(`${this.props.user.uid}/apts/${newApt.key()}`).set(true)
    // TOTO: find 5 most recent crimes, check if apt_uid exists in crimes, push/update with new crimes
    this.handleNextApt()
  }


  // shows the current apartment ------ renderApt() - n/A
  renderApt(){
    // <Text style={styles.listFavs}>Apts for {this.props.user.name} </Text>
    // <Text style={styles.listFavs}>Images: {this.state.apt.picture_urls[0]} </Text>
    // <Text style={styles.listFavs}>{this.state.apt.price_formatted} per night</Text>
    // <Text style={styles.listFavs}>{this.state.apt.property_type} | </Text>
    // <Text style={styles.listFavs}>{this.state.apt.smart_location}</Text>
    // <Text style={styles.listFavs}>Fits: {this.state.apt.person_capacity} </Text>
    // <Text style={styles.listFavs}>Min nights: {this.state.apt.min_nights} </Text>
    return (
      <View style={styles.card}>
        <Image style={styles.thumbnail} source={{ uri: this.state.apt.picture_urls[0] }} />
        <Text style={styles.text}>{this.state.apt.price_formatted} per night</Text>
      </View>
    )
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
      this.props.navigator.popToRoute(home)
    }
  }


  _resetState() {
    this.state.pan.setValue({x: 0, y: 0});
    this.state.enter.setValue(0);
    this.handleNextApt();
    this._animateEntrance();
  }


  render(){
    /** CREDIT: code was copied from brentvatne.github.com for the react-native-animated-tinder swipe effects **/
    /** LINK:   https://github.com/brentvatne/react-native-animated-demo-tinder/blob/master/index.ios.js      **/
    let { pan, enter, } = this.state;
    let [translateX, translateY] = [pan.x, pan.y];

    let rotate = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: ["-30deg", "0deg", "30deg"]});
    let opacity = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: [0.5, 1, 0.5]})
    let scale = enter;

    let animatedCardStyles = {transform: [{translateX}, {translateY}, {rotate}, {scale}], opacity};

    let yupOpacity = pan.x.interpolate({inputRange: [0, 150], outputRange: [0, 1]});
    let yupScale = pan.x.interpolate({inputRange: [0, 150], outputRange: [0.5, 1], extrapolate: 'clamp'});
    let animatedYupStyles = {transform: [{scale: yupScale}], opacity: yupOpacity}

    let nopeOpacity = pan.x.interpolate({inputRange: [-150, 0], outputRange: [1, 0]});
    let nopeScale = pan.x.interpolate({inputRange: [-150, 0], outputRange: [1, 0.5], extrapolate: 'clamp'});
    let animatedNopeStyles = {transform: [{scale: nopeScale}], opacity: nopeOpacity}

    return (
      <View style={styles.container}>
        <Animated.View 
          style={[styles.card, animatedCardStyles, {backgroundColor: this.state.person}]} 
          {...this._panResponder.panHandlers}>
        </Animated.View>

        <Animated.View style={[styles.nope, animatedNopeStyles]}>
          <Text style={styles.nopeText}>Nope!</Text>
        </Animated.View>

        <Animated.View style={[styles.yup, animatedYupStyles]}>
          <Text style={styles.yupText}>Yup!</Text>
        </Animated.View>
      </View>
    )
  }
};

// YesOrNo StyleSheet
var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  card: {
    width: 200,
    height: 200,
    backgroundColor: 'red',
  },
  yup: {
    borderColor: 'green',
    borderWidth: 2,
    position: 'absolute',
    padding: 20,
    bottom: 20,
    borderRadius: 5,
    right: 20,
  },
  yupText: {
    fontSize: 16,
    color: 'green',
  },
  nope: {
    borderColor: 'red',
    borderWidth: 2,
    position: 'absolute',
    bottom: 20,
    padding: 20,
    borderRadius: 5,
    left: 20,
  },
  nopeText: {
    fontSize: 16,
    color: 'red',
  },
  // card: {
  //   alignItems: 'center',
  //   borderRadius: 5,
  //   overflow: 'hidden',
  //   borderColor: 'grey',
  //   backgroundColor: 'white',
  //   borderWidth: 1,
  //   elevation: 1,
  // },
  thumbnail: {
    flex: 1,
    width: 300,
    height: 300,
  },
  text: {
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 10
  },
  noMoreCards: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})


YesOrNo.propTypes = {
  user: React.PropTypes.object.isRequired,
  apts: React.PropTypes.array.isRequired,
  homepage: React.PropTypes.object,
};

module.exports = YesOrNo;








/// ORIGINAL RENDER 

      // <View style={styles.mainContainer}>
      //   <View style={styles.formContainer}>
      //     <Text style={styles.listFavs}>Apts for {this.props.user.name} </Text>
      //     <Text style={styles.listFavs}>Images: {this.state.apt.picture_urls[0]} </Text>
      //     <Text style={styles.listFavs}>{this.state.apt.price_formatted} per night</Text>
      //     <Text style={styles.listFavs}>{this.state.apt.property_type} | </Text>
      //     <Text style={styles.listFavs}>{this.state.apt.smart_location}</Text>
      //     <Text style={styles.listFavs}>Fits: {this.state.apt.person_capacity} </Text>
      //     <Text style={styles.listFavs}>Min nights: {this.state.apt.min_nights} </Text>

      //     {/* Temp 'YES' Button to Save Apt */}
      //     <TouchableHighlight
      //       style={styles.button}
      //       onPress={this.handleSaveApt.bind(this)}
      //       underlayColor='white' >
      //       <Text style={styles.buttonText}>I WANT!</Text>
      //     </TouchableHighlight>

      //     {/* Temp 'NAHH' Button to get Next Apt */}
      //     <TouchableHighlight
      //       style={styles.button}
      //       onPress={this.handleNextApt.bind(this)}
      //       underlayColor='white' >
      //       <Text style={styles.buttonText}>Nah, Pass</Text>
      //     </TouchableHighlight>

      //   </View>
      // </View>