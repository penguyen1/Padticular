'use strict'
const React = require('react-native');
const Firebase = require('firebase');
var TimerMixin = require('react-timer-mixin');
// var styles = require('./Helpers/Styles');
var ViewSite = require('./Helpers/Web');        // WebView     
var ref = new Firebase('https://dazzling-inferno-3629.firebaseio.com');
var Search = require('./Search');               // for testing -- belongs in Nav
// var Nav = require('./Nav');

var {
  Dimensions,
  Navigator,
  PixelRatio,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View
} = React;

// Scrollable Parallax View
var Parallax = require('react-native-parallax');
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
  }

  // called ONCE BEFORE Homepage Component is rendered
  componentWillMount(){
    this.getFavorites();        // getting favorites (in case of new additions)
  }

  // called when Homepage Component is unmounting
  componentWillUnmount(){
    // removes all Firebase callbacks (no repeatitive issues)
    userAptRef.off()
    console.log('Leaving homepage: ', this.state.favorites)
  }


  // Queries & setState of apartment favorites from Firebase
  getFavorites(){
    this.state.favorites = []     // reset favorites

    // get all user's apts
    console.log('getting favorites')
    this.userAptRef.orderByKey().on("child_added", (snap)=>{
      var apt_uid = snap.key()
      ref.child(`/apts/${apt_uid}`).once('value', (snapshot)=>{
        this.state.favorites.push(snapshot.val())
      })
    })

    // delays asynchronous issue 
    TimerMixin.setTimeout(()=>{
      this.setState({
        refreshing: false,
        favorites: this.state.favorites
      })
      console.log('apt update? ', this.state.favorites)
    },500)
  }

  // Redirect to Search Component
  handleGoToSearch(){
    this.props.navigator.push({
      title: 'Search',
      component: Search,
      passProps: {
        user: this.props.user,
        homepage: this.props.navigator.navigationContext._currentRoute,
      }
    })
  }

  // Redirects to Apartment Listing Website 
  handleGoToSite(url){
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

  // displays info of an apartment - id, capacity, address, pic_url, price & property_type
  renderApt(apt, i){
    console.log('rendering apt: ', apt)
    console.log('rendering key: ', i)
    // return (
    //   <View>
    //     <Text> Apt Info Here </Text>
    //   </View>
    // )
  }

  render(){
    var check = this.state.favorites.length ? (this.state.favorites.map((apt, i)=>this.renderApt(apt, i))) : (<Text style={styles.empty}>You dont got no apartment favorites!</Text>)

    return(
      <ScrollView 
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)} />}
      >
        {/* lists EACH user's favorites */}
        {check}
        

        {/* Temp 'Search' Button to Search Component */}
        <TouchableHighlight
          style={styles.button}
          onPress={this.handleGoToSearch.bind(this)}
          underlayColor='white' >
          <Text style={styles.buttonText}>Find Apartments</Text>
        </TouchableHighlight>

        {/* Temp Logout Button */}
        <TouchableHighlight
          style={styles.button}
          onPress={this.handleLogout.bind(this)}
          underlayColor='white' >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableHighlight>
      </ScrollView>
    )
  }
}


// Homepage StyleSheet
var styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 30,
    marginTop: 65,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#48BBEC'
  },
  image: {
    height: IMAGE_HEIGHT,
  },
  overlay: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
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
});

Homepage.propTypes = {
  user: React.PropTypes.object.isRequired,
  apts: React.PropTypes.object,
  reset: React.PropTypes.bool
};

module.exports = Homepage;