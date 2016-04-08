'use strict'
const React = require('react-native');
const Firebase = require('firebase');
var styles = require('./Helpers/Styles');
// var Profile = require('./Profile');        // WebView 
// var Login = require('./Login');
var ref = new Firebase('https://dazzling-inferno-3629.firebaseio.com');
var Search = require('./Search');                  // for testing -- doesnt belong here
// var Nav = require('./Nav');

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
  console.log( authData ? "@Home: User is logged in!" : "@Home: User is logged out!" );
}

class Homepage extends React.Component{
  constructor(props){
    super(props);
    // this.ds =  new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2})
    this.state = {
      dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
      //dataSource: [] // setState in componentWillMount()???
      error: '',
      favorites: [], 
    };
    this.userAptRef = ref.child(`/users/${this.props.user.uid}/apts`);
  }

  // called ONCE Homepage Component is rendered
  componentWillMount(){
    // var user = ref.child('users/').child(this.props.user.uid); 
    ref.child(`/users/${this.props.user.uid}`).onAuth(authDataCallback);          // checks auth state 
    // this.getFavorites();
    console.log('homepage componentWillMount')
    this.getFavorites();        // getting favorites (in case of new additions)
  }

  // componentDidMount(){
  //   console.log('homepage componentDidMount')
  //   this.getFavorites();        // getting favorites (in case of new additions)
  // }

  // Queries & setState of apartment favorites from Firebase
  getFavorites(){
    // get all user's apts
    console.log('getting favorites')
    this.userAptRef.on("value", (snap)=>{
      // var m = this.aptRef.child(snap.key())

      snap.forEach((key)=>{
        var apt_uid = key.key()
        // console.log('apt_uid: ', apt_uid)

        ref.child(`/apts/${apt_uid}`).once('value', (snapshot)=>{
          // console.log('apartment info: ', snapshot.val())
          this.state.favorites.push(snapshot.val())
        })

      })
    })
    console.log('all my saved apts: ', this.state.favorites)

  }

  // Redirect to WebView of Apt Listing
  handleGoToProfile(){      // needs to be passed apartment list id!
    console.log('Takes me to the apartment listing website!')
    // NOW A WebView!
  }

  // displays info of an apartment - id, capacity, address, pic_url, price & property_type
  renderApt(){
    return (
      <View>
        <Text> Apt Info Here </Text>
      </View>
    )
  }

  // Redirect to Search Component
  handleGoToSearch(){
    this.props.navigator.push({
      title: 'Search',
      component: Search,
      passProps: {
        user: this.props.user,
        homepage: this.props.navigator.navigationContext._currentRoute
      }
    })
  }

  // Logout & Redirect to Login Component
  handleLogout(){
    ref.unauth();                 // Destroys User Auth
    // this.props.navigator.replace({   // can i switch btw Signup & Login without having a back button ??? 
    //   title: 'Login',
    //   component: Login
    // })
    this.props.navigator.pop();   // go back to previous component - Signup
  }

  render(){

    return(
      <View style={styles.mainContainer}>
        {/* Homepage Greeting Header */}
        <Text style={styles.header}>Hello, {this.props.user.name}!</Text>
        {/* ListView of User's Favorited Apartments */}
        <View style={styles.favorites}>
          <Text style={styles.listTitle}>Favorites List</Text>
          <Text style={styles.listFavs}>List of Favorite Apartments here</Text>

          {/* Temp 'View' Button to Profile Component */}
          <TouchableHighlight
            style={styles.button}
            onPress={this.handleGoToProfile.bind(this)}
            underlayColor='white' >
            <Text style={styles.buttonText}>Go to Profile</Text>
          </TouchableHighlight>

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

        </View>
      </View>
    )
  }
}

Homepage.propTypes = {
  user: React.PropTypes.object.isRequired,
};

  // apts: React.PropTypes.object
module.exports = Homepage;