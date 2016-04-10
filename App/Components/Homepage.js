'use strict'
const React = require('react-native');
const Parallax = require('react-native-parallax');
const Firebase = require('firebase');
var TimerMixin = require('react-timer-mixin');
var Web = require('./Helpers/Web');
var ViewSite = require('./Helpers/Web');        // WebView     
var ref = new Firebase('https://dazzling-inferno-3629.firebaseio.com');
var Search = require('./Search');               // for testing -- belongs in Nav
// var Nav = require('./Nav');

var {
  Dimensions,
  Image,
  Navigator,
  PixelRatio,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  WebView,
  View
} = React;

// Scrollable Parallax View
var IMAGE_WIDTH = Dimensions.get('window').width;
var IMAGE_HEIGHT = IMAGE_WIDTH / 2;
var PIXEL_RATIO = PixelRatio.get();
var PARALLAX_FACTOR = 0.3;


// verifies user auth state 
function authDataCallback(authData) {
  console.log( authData ? "@Home: User is logged in!" : "@Home: User is logged out!" );
}

class Homepage extends React.Component{
  constructor(props){
    super(props);
    // this.ds =  new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2})
    this.state = {
      // dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
      refreshing: false,
      favorites: [],
    };
    this.userAptRef = ref.child(`/users/${this.props.user.uid}/apts`);
    this.homeRoute = this.props.navigator.navigationContext._currentRoute;
  }

  // called ONCE BEFORE Homepage Component is rendered
  componentWillMount(){
    this.getFavorites();        // getting favorites (in case of new additions)
  }

  // called when Homepage Component is unmounting
  componentWillUnmount(){
    // removes all Firebase callbacks (no repeatitive issues)
    ref.off()
    console.log('Leaving homepage: ', this.state.favorites)
  }


  // Queries & setState of apartment favorites from Firebase
  getFavorites(){
    this.state.favorites = []     // reset favorites

    // get all user's apts
    console.log('getting favorites')
    this.userAptRef.on("child_added", (snap)=>{
      var apt_uid = snap.key()
      ref.child(`/apts/${apt_uid}`).once('value', (snapshot)=>{
        this.state.favorites.push(snapshot.val())
      })
    })

    // delays asynchronous issue 
    TimerMixin.setTimeout(()=>{
      console.log('PART 1 - checking favorites state: ', this.state.favorites)
      this.setState({
        refreshing: false,
        favorites: this.state.favorites
      })
      console.log('PART 2 - apt update: ', this.state.favorites)
    },500)
  }

  // Redirect to Search Component
  handleGoToSearch(){
    this.props.navigator.push({
      title: 'Search',
      component: Search,
      leftButtonTitle: 'Back',
      onLeftButtonPress: () => { this.props.navigator.pop() },
      rightButtonTitle: 'Logout',
      onRightButtonPress: () => {
        ref.unauth();                 // Destroys User Auth
        this.props.navigator.popToTop();
      },
      passProps: {
        user: this.props.user,
        homepage: this.homeRoute,
      },
    })
  }

  // Redirects to Apartment Listing Website 
  handleGoToSite(i){
    var url = `https://www.airbnb.com/rooms/${this.state.favorites[i].id}`
    console.log('id: ', this.state.favorites[i].id)
    this.props.navigator.push({
      title: 'Web View',
      component: Web,
      passProps: {url}
    })
  }

  // Logout & Redirect to Login Component --- belongs in Nav Bar!
  handleLogout(){
    ref.unauth();                 // Destroys User Auth
    this.props.navigator.pop();   // go back to previous component - Signup
  }

  // solution to reupdating new additions to favorites list???
  _onRefresh() {
    console.log('refreshing - updating for new favorites!')
    this.setState({refreshing: true});
    this.getFavorites();
  }

  // called if user has no favorites
  renderEmptyMsg() {
    return ( 
      <Parallax.Image
        style={{ height: IMAGE_HEIGHT }}
        overlayStyle={{ backgroundColor: 'rgba(0,0,0,0.4)'}}
        source={{ uri: 'http://loremflickr.com/640/480' }} >
          <Text style={styles.title}>You dont got no favorites!</Text>
      </Parallax.Image>
    )
  }

  // displays info of an apartment - id, capacity, address, pic_url, price & property_type
  renderApt(apt, i){
    var pic_url = apt.picture_urls[0].toString()
    return (
      <Parallax.Image
        key={i}
        style={{ height: IMAGE_HEIGHT }}
        overlayStyle={{ backgroundColor: 'rgba(0,0,0,0.4)'}}
        source={{ uri: pic_url }} 
        onPress={this.handleGoToSite.bind(this, i)} >
        <Text style={styles.title} key={i}> {apt.address} </Text>
      </Parallax.Image>
    )
    // .state.favorites[i]
  }

  render() {
    var check = this.state.favorites.length 
                  ? (this.state.favorites.map((apt, i)=>this.renderApt(apt, i))) 
                  : (this.renderEmptyMsg()) 
    return (
      <Parallax.ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)} />}
      >
      {/* Temp 'Search' Button to Search Component */}
      <View style={styles.footer}>
        <TouchableHighlight
          style={styles.button}
          onPress={this.handleGoToSearch.bind(this)}
          underlayColor='white' >
          <Text style={styles.buttonText}>Find More Apartments</Text>
        </TouchableHighlight>
      </View>

      {/* lists EACH user's favorites */}
      {check}

      </Parallax.ScrollView>
    )
  }
}

// Homepage StyleSheet
var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6EF',
    flexDirection: 'column',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 25,
    fontWeight: 'bold',
    color: 'white',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 1,
    shadowColor: 'black',
    shadowOpacity: 0.8,
    marginTop: 60,
  },
  empty: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
    lineHeight: 40,
  },
  url: {
    opacity: 0.5,
    fontSize: 10,
    position: 'absolute',
    color: 'white',
    left: 5,
    bottom: 5,
  },
  row: {
    borderColor: 'grey',
    borderWidth: 1,
    padding: 20,
    backgroundColor: '#3a5795',
    margin: 5,
  },
  text: {
    alignSelf: 'center',
    color: '#fff',
  },
  scrollview: {
    flex: 1,
  },
  buttonText: {
    fontSize: 18,
    color: '#111',
    alignSelf: 'center',
    textAlign: 'center',
  },
  button: {
    height: 50,
    width: 140,
    backgroundColor: '#00b8ff',
    borderColor: '#233fc7',
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 15,
    justifyContent: 'center'
  },
  footer: {
    marginTop: 7,
    marginLeft: 95,
    flexDirection: 'row',
  },
});

Homepage.propTypes = {
  user: React.PropTypes.object.isRequired
};

module.exports = Homepage;