                                            

                                            /*** ATTENTION!! ***/ 
/** CREDIT: some of the code was copied from GitHub/brentvatne for react-native-animated-tinder swipe animation  **/
/** FOLLOWING METHODS WERE COPIED: componentDidMount, _animateEntrance, componentWillMount, _resetState & render **/
/** LINK:   https://github.com/brentvatne/react-native-animated-demo-tinder/blob/master/index.ios.js             **/

'use strict'
const React = require('react-native');
const Firebase = require('firebase');
const SwipeCards = require('react-native-swipe-cards');  // .default;
const clamp = require('clamp');
const Dimensions = require('Dimensions');
const Defaults = require('./Helpers/Defaults');

var ref = new Firebase('https://dazzling-inferno-3629.firebaseio.com/');
var api = require('../Utils/api');
var Homepage = require('./Homepage');
// var styles = require('./Helpers/Styles');
// var Nav = require('./Nav');
var SWIPE_THRESHOLD = 120;
var NEXT_CARD_POSITION_OFFSET = 4;
var NEXT_CARD_SIZE_OFFSET = 8;

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

class Card extends Component {
  render() {
    return (
      <View style={styles.cardResizeContainer}>
        <Animated.View style={[styles.cardContainer, this.props.animatedCardContainerStyles]}>
          <Animated.View style={[styles.card, this.props.animatedCardStyles]} {...this.props.panResponder}>
            <Image source={{uri: this.props.picture_urls[0]}} style={styles.cardImage}>
              <Animated.View style={[styles.cardImageTextContainer, styles.cardImageYupContainer, this.props.animatedYupStyles]}>
                <Text style={[styles.cardImageText, styles.cardImageYupText]}>SAVE IT!</Text>
              </Animated.View>
              <Animated.View style={[styles.cardImageTextContainer, styles.cardImageNopeContainer, this.props.animatedNopeStyles]}>
                <Text style={[styles.cardImageText, styles.cardImageNopeText]}>PASS</Text>
              </Animated.View>
            </Image>
            <View style={styles.cardLabelContainer}>
              <Text style={styles.name}>{this.props.smart_location}</Text>
              <Text style={styles.value}>{this.props.price_formatted}</Text>
            </View>
          </Animated.View>   
        </Animated.View>
      </View>
    );
  }
}

class YesOrNo extends React.Component {
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
          }).start(this._resetState.bind(this))
        } else {
          Animated.spring(this.state.pan, {
            toValue: {x: 0, y: 0},
            friction: 4
          }).start()
        }
      }
    })
    this.handleNextApt()
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
    this._resetState()
    // this.handleNextApt()
  }

  // gets next apartment
  handleNextApt(){
    console.log('rendering next apt')
    console.log('Apartments left: ', this.props.apts.length)
    // let nextPosition = (this.state.currentPosition + 1) % this.props.apts.length
    // are there any apartments left in this.props.apts?
    if(this.props.apts.length){
      var pending = this.props.apts.pop()
      // call getApartmentInfo in api.js & get back a response
      api.getApartmentInfo(pending)
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
    console.log('I PRESENT TO YOU --- ', this.state.apt);
    // this._animateEntrance();
  }

  _resetState() {
    // this.state.pan = new Animated.ValueXY();
    this.state.pan.setValue({x: 0, y: 0});
    this.state.enter.setValue(0);
    this.handleNextApt();
  }

  handleNopePress() {
    let screenwidth = Dimensions.get('window').width;
    let panlength = screenwidth + 100

    Animated.timing(this.state.pan, {
          toValue: {x: -panlength, y: 0}
    }).start(this._resetState.bind(this))
  }

  handleYupPress() {
    let screenwidth = Dimensions.get('window').width;
    let panlength = screenwidth + 100

    Animated.timing(this.state.pan, {
          toValue: {x: panlength, y: 0}
    }).start(this._resetState.bind(this))
  }

  render(){
    let { pan, enter, apt } = this.state;
    let [translateX, translateY] = [pan.x, pan.y];

    // card 0 animation
    // let rotate = pan.x.interpolate({inputRange: [-240, 0, 240], outputRange: ["-30deg", "0deg", "30deg"]});
    // let opacity = pan.x.interpolate({inputRange: [-200, 0, 200], outputRange: [0.5, 1, 0.5]})   // opt out
    // let scale = enter;  // opt out

    // let animatedCardStyles = {transform: [{translateX}, {translateY}, {rotate}, {scale}], opacity};  // cut off end

    // let yupOpacity = pan.x.interpolate({inputRange: [0, 150], outputRange: [0, 1]});
    // let yupScale = pan.x.interpolate({inputRange: [0, 150], outputRange: [0.5, 1], extrapolate: 'clamp'});
    // let animatedYupStyles = {transform: [{scale: yupScale}], opacity: yupOpacity}

    // let nopeOpacity = pan.x.interpolate({inputRange: [-150, 0], outputRange: [1, 0]});
    // let nopeScale = pan.x.interpolate({inputRange: [-150, 0], outputRange: [1, 0.5], extrapolate: 'clamp'});
    // let animatedNopeStyles = {transform: [{scale: nopeScale}], opacity: nopeOpacity}

    // card 0 animation
    let rotate = pan.x.interpolate({inputRange: [-240, 0, 240], outputRange: ["-30deg", "0deg", "30deg"]});
    let animatedCardStyles = {transform: [{translateX}, {translateY}, {rotate}]};

    let yupOpacity = pan.x.interpolate({inputRange: [0, SWIPE_THRESHOLD], outputRange: [0, 1], extrapolate: 'clamp'});      // save apt??
    // console.log('yupOpacity: ', yupOpacity)
    let animatedYupStyles = {opacity: yupOpacity}
    let nopeOpacity = pan.x.interpolate({inputRange: [-SWIPE_THRESHOLD, 0], outputRange: [1, 0], extrapolate: 'clamp'});
    // console.log('NopeOpacity: ', NopeOpacity)
    let animatedNopeStyles = {opacity: nopeOpacity}

    let card0AnimatedStyles = {
      animatedCardStyles: animatedCardStyles, 
      animatedNopeStyles: animatedNopeStyles,
      animatedYupStyles: animatedYupStyles
    }

    let person0 = this.state.apt

    // return (
    //   <View style={styles.container}>
    //     <Animated.View 
    //       style={[styles.card, animatedCardStyles, {backgroundColor: 'red'}]} 
    //       {...this._panResponder.panHandlers}>
    //     </Animated.View>

    //     <Animated.View style={[styles.nope, animatedNopeStyles]}>
    //       <Text style={styles.nopeText}>Nope!</Text>
    //     </Animated.View>

    //     <Animated.View style={[styles.yup, animatedYupStyles]}>
    //       <Text style={styles.yupText}>Yup!</Text>
    //     </Animated.View>
    //   </View>
    // )

    return(
      <View style={styles.bodyContainer}>
        <View style={styles.responsiveContainer}>

          <View style={styles.buttonsContainer}>
            <View style={styles.buttonContainer}>
              <TouchableHighlight style={[styles.button, styles.buttonNope]} underlayColor='#EEE' onPress={() => {this.handleNopePress()}}>
                  <Text style={styles.nopeText}>Ew, Pass</Text>
              </TouchableHighlight>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableHighlight style={[styles.button, styles.buttonYup]} underlayColor='#EEE' onPress={() => {this.handleYupPress(); this.handleSaveApt()}}>
                  <Text style={styles.yupText}>Save it!</Text>
              </TouchableHighlight>
            </View>
          </View>

          <View style={styles.cardsContainer}>
            <Card key={person0.name} {...person0} {...card0AnimatedStyles} panResponder={this._panResponder.panHandlers}/>
          </View>

        </View>   
      </View>
    )
  }
};

var styles = StyleSheet.create({
  // main container
  bodyContainer: {
    flex: 1,
    //margin: 10,
    backgroundColor: '#F5FCFF',
  },

  // we keep the bottom button sections at height 100
  // the card expands to take up all the rest of the space
  responsiveContainer: {
    flex: 1,
    paddingBottom: 100,
  },

  // cards
  cardsContainer: {
    flex: 1,
  },

  cardResizeContainer: {
    flex: 1,
    position: 'absolute',
    top: 70,
    left: 40,
    bottom: 40, 
    right: 40,
  },

  cardContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0, 
    right: 0,
    justifyContent: 'flex-end',
  },

  card: {   
    position: 'relative',
    borderColor: '#AAA',
    borderWidth: 1,
    borderRadius: 8,  
    flex: 1,
    //overflow: 'hidden',
    shadowRadius: 2,
    shadowColor: '#BBB',
    shadowOpacity: 0.8,
    shadowOffset: {
      height: 1,
      width: 0,
    }
  },

  cardImage: {
    flex: 1,
    borderRadius: 8,
  },

  cardImageTextContainer: {
    position: 'absolute',
    borderWidth: 3,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 6,
    paddingRight: 6,
    borderRadius: 4,
    opacity: 0,
  },
  cardImageYupContainer : {
    top: 40,
    left: 40,
    transform:[{rotate: '-20deg'}],
    borderColor: 'green',
    
  },
  cardImageNopeContainer : {
    top: 40,
    right: 40,
    transform:[{rotate: '20deg'}],
    borderColor: 'red',
  },
  cardImageText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  cardImageNopeText: {
    color: 'red',
    backgroundColor: 'rgba(0,0,0,0)', 
  },
  cardImageYupText: {
    color: 'green',
    backgroundColor: 'rgba(0,0,0,0)',
  },

  cardLabelContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    //borderColor: "#999",
    borderRadius: 8,
    //borderBottomWidth: 2,
    padding: 8,
  },
  name: {
    fontWeight: 'bold',
    color: '#999',
  },
  value: {
    flex: 1,
    textAlign: 'right',
    fontWeight: 'bold',
    color: '#999',
  },
  
  // buttons

  buttonsContainer: {
    height:100,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
  },
  button: {
    borderWidth: 2,
    padding: 8,
    borderRadius: 5,
  },
  buttonNope: {
    borderColor: 'red',
  },
  buttonYup: {
    borderColor: 'green',
  },
  yupText: {
    fontSize: 20,
    color: 'green',
  },
  nopeText: {
    fontSize: 20,
    color: 'red',
  },

});

// // YesOrNo StyleSheet
// var styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   card: {
//     width: 200,
//     height: 200,
//     backgroundColor: 'red',
//   },
//   yup: {
//     borderColor: 'green',
//     borderWidth: 2,
//     position: 'absolute',
//     padding: 20,
//     bottom: 20,
//     borderRadius: 5,
//     right: 20,
//   },
//   yupText: {
//     fontSize: 16,
//     color: 'green',
//   },
//   nope: {
//     borderColor: 'red',
//     borderWidth: 2,
//     position: 'absolute',
//     bottom: 20,
//     padding: 20,
//     borderRadius: 5,
//     left: 20,
//   },
//   nopeText: {
//     fontSize: 16,
//     color: 'red',
//   },
//   thumbnail: {
//     flex: 1,
//     width: 300,
//     height: 300,
//   },
//   text: {
//     fontSize: 20,
//     paddingTop: 10,
//     paddingBottom: 10
//   },
//   noMoreCards: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// })


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