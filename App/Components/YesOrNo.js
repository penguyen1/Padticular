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
var TimerMixin = require('react-timer-mixin');
var ref = new Firebase('https://dazzling-inferno-3629.firebaseio.com/');
var api = require('../Utils/api');
var Homepage = require('./Homepage');

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

// Tinder Card effects
var SWIPE_THRESHOLD = 120;
var NEXT_CARD_POSITION_OFFSET = 4;
var NEXT_CARD_SIZE_OFFSET = 8;
var IMAGE_WIDTH = Dimensions.get('window').width;
var IMAGE_HEIGHT = Dimensions.get('window').height;

class Card extends Component {
  render() {
    return (
      <View style={styles.cardResizeContainer}>
        <Animated.View style={[styles.cardContainer, this.props.animatedCardContainerStyles]}>
          <Animated.View style={[styles.card, this.props.animatedCardStyles]} {...this.props.panResponder}>
            <Image source={{uri: this.props.picture_urls[0]}} style={styles.cardImage}>
              <Animated.View style={[styles.cardImageTextContainer, styles.cardImageYupContainer, this.props.animatedYupStyles]}>
                <Text style={[styles.cardImageText, styles.cardImageYupText]}>WANT IT!</Text>
              </Animated.View>
              <Animated.View style={[styles.cardImageTextContainer, styles.cardImageNopeContainer, this.props.animatedNopeStyles]}>
                <Text style={[styles.cardImageText, styles.cardImageNopeText]}>NO THANK YOU</Text>
              </Animated.View>
              <Text style={styles.title}>{this.props.price_formatted}/night</Text>
              <Text style={styles.subtitle}>{this.props.property_type} | {this.props.smart_location}</Text>
              <Text style={styles.subtitle}>{this.props.bedrooms} Bedrooms | {this.props.bathrooms} Bathrooms</Text>
              <Text style={styles.subtitle}>{this.props.min_nights} night min | Fits {this.props.person_capacity} people</Text>
              <Text style={styles.fill}></Text>
            </Image>
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
    // ref.off()
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
    
    // delays asynchronous issue 
    TimerMixin.setTimeout(()=>{this._resetState()}, 500)
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

    let rotate = pan.x.interpolate({inputRange: [-240, 0, 240], outputRange: ["-30deg", "0deg", "30deg"]});
    let animatedCardStyles = {transform: [{translateX}, {translateY}, {rotate}]};

    let yupOpacity = pan.x.interpolate({inputRange: [0, SWIPE_THRESHOLD], outputRange: [0, 1], extrapolate: 'clamp'});      // save apt here??
    let animatedYupStyles = {opacity: yupOpacity}
    let nopeOpacity = pan.x.interpolate({inputRange: [-SWIPE_THRESHOLD, 0], outputRange: [1, 0], extrapolate: 'clamp'});
    let animatedNopeStyles = {opacity: nopeOpacity}

    let card0AnimatedStyles = {
      animatedCardStyles: animatedCardStyles, 
      animatedNopeStyles: animatedNopeStyles,
      animatedYupStyles: animatedYupStyles
    }

    let person0 = this.state.apt
    console.log('person0: ', person0)
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
            <Card key={person0.id} {...person0} {...card0AnimatedStyles} panResponder={this._panResponder.panHandlers}/>
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
    width: IMAGE_WIDTH
  },
  cardResizeContainer: {
    flex: 1,
    position: 'absolute',
    top: 60,
    left: 0,
    bottom: 0, 
    right: 0,
  },
  cardContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0, 
    right: 0,
    justifyContent: 'flex-end',
    width: IMAGE_WIDTH,
  },
  card: {   
    position: 'relative',
    borderColor: '#AAA',
    borderWidth: 1,
    borderRadius: 8,  
    flex: 1,
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
    backgroundColor: 'rgba(0,0,0,0.8)',
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
  title: {
    fontSize: 40,
    textAlign: 'center',
    lineHeight: 55,
    fontWeight: 'bold',
    color: 'white',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 1,
    shadowColor: 'black',
    shadowOpacity: 0.8,
    marginTop: 160,
    opacity: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 25,
    color: 'white',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 1,
    shadowColor: 'black',
    shadowOpacity: 0.8,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  fill: {
    lineHeight: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
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

YesOrNo.propTypes = {
  user: React.PropTypes.object.isRequired,
  apts: React.PropTypes.array.isRequired,
  homepage: React.PropTypes.object,
};

module.exports = YesOrNo;