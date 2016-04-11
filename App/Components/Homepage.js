'use strict'
const React = require('react-native');
const Parallax = require('react-native-parallax');
const Firebase = require('firebase');
var TimerMixin = require('react-timer-mixin');
var Web = require('./Helpers/Web');               // WebView 
var Search = require('./Search');            
var ref = new Firebase('https://dazzling-inferno-3629.firebaseio.com');

var {
  Component,
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
    // ref.off()
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
      // console.log('PART 1 - checking favorites state: ', this.state.favorites)
      this.setState({
        refreshing: false,
        favorites: this.state.favorites
      })
      // console.log('PART 2 - apt update: ', this.state.favorites)
    },500)
  }

  // Redirect to Search Component
  handleGoToSearch(){
    this.props.navigator.push({
      title: 'Padticular Apartments',
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
  handleGoToSite(apt){
    // console.log('handleGoToSite: ', this)
    // console.log('handleGoToSite apt: ', apt)
    var url = `https://www.airbnb.com/rooms/${apt}`
    this.props.navigator.push({
      title: 'Web View',
      component: Web,
      passProps: {
        id: apt,
        url: url
      }
    })
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
        key={999999999}
        style={{ height: 420, width: 380 }}
        source={{ uri: 'http://images.reachsite.com/5a519b0f-ba89-4015-9c21-6c56515ef1fd/media/429876/medium/429876.PNG?gen=1' }} >
          <Text style={styles.empty}>You got no favorites!</Text>
      </Parallax.Image>
    )
  }

  // displays info of an apartment - id, capacity, address, pic_url, price & property_type
  renderApt(apt){
    // console.log('rendering apt: ', apt)
    // console.log('rendering this: ', this)
    var pic_url = apt.picture_urls[0].toString()
    return (
      <Parallax.Image
        key={apt.id}
        style={{ height: IMAGE_HEIGHT }}
        overlayStyle={{ backgroundColor: 'rgba(0,0,0,0.5)'}}
        source={{ uri: pic_url }} 
        onPress={this.handleGoToSite.bind(this, apt.id)} >
          <Text style={styles.title} key={apt.id}> {apt.price_formatted}/night</Text>
          <Text style={styles.subtitle}> {apt.property_type} | {apt.smart_location}</Text>
      </Parallax.Image>
    )
  }

  render() {
    var check = this.state.favorites.length 
                  ? (this.state.favorites.map(this.renderApt.bind(this))) 
                  : (this.renderEmptyMsg()) 
    return (
      <View style={[styles.container]}>
        <View >
          <Image source={require('./Images/NYC2.jpg')} style={styles.backgroundImage} ></Image>
        </View>

        <Parallax.ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)} />}
        >
        {/* Temp 'Search' Button to Search Component */}
        <Parallax.Image
          style={{ height: IMAGE_HEIGHT }}
          overlayStyle={{ backgroundColor: 'rgba(0,0,0,0.1)'}}
          source={{ uri: 'http://clarityonfire.com/wp-content/uploads/2014/04/2.jpg' }} 
          onPress={this.handleGoToSearch.bind(this)} >
            <Text style={styles.search}>Search Apartments</Text>
        </Parallax.Image>

        {/* lists EACH user's favorites */}
        {check}
        </Parallax.ScrollView>
      </View>
    )
  }
}

// Homepage StyleSheet
var styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#F6F6EF',
    flexDirection: 'column',
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
  },
  fixed: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundImage: {
    position: 'absolute',
    resizeMode: 'cover',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  title: {
    position: 'relative',
    fontSize: 30,
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
    marginTop: 40,
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
    marginTop: 0,
  },
  search: {
    position: 'absolute',
    fontSize: 35,
    textAlign: 'center',
    paddingBottom: 10,
    lineHeight: 50,
    fontWeight: 'bold',
    color: 'white',
    shadowColor: 'black',
    shadowOpacity: 1,
    marginTop: 60,
    marginLeft: 28
  },
  empty: {
    fontSize: 34,
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontWeight: 'bold',
    color: 'black',
    lineHeight: 40,
    marginTop: 170,
    shadowColor: 'black',
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
    marginTop: 50,
    marginLeft: 115,
    justifyContent: 'center'
  },
  footer: {
    marginTop: 7,
    marginLeft: 95,
    flexDirection: 'row',
  },
});

Homepage.propTypes = {
  user: React.PropTypes.object.isRequired,
};

module.exports = Homepage;