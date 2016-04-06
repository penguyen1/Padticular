'use strict'
const React = require('react-native');
const Firebase = require('firebase');
var styles = require('./Helpers/Styles');
var Profile = require('./Profile');
var Login = require('./Login');
var userRef = new Firebase('https://dazzling-inferno-3629.firebaseio.com/');
// var Search = require('./Search');
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

class Homepage extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 }),
      error: '',
      favorites: [], 
    };
  }

  // called ONCE Homepage Component is rendered
  componentWillMount(){
    console.log('passed user info from Login | Signup: ', this.props.user);
    console.log('I should be getting users apartment favorites from Firebase here');
    // this.getFavorites();
  }

  // Queries & setState of apartment favorites from Firebase  // apartment favorites: [apt_ids]? or [{apt_info}]?
  getFavorites(){
    fetch( FIREBASE_FAVORITE_APARTMENT_QUERY )
      .then( (res)=>res.json() )      // turns response into JSON first
      .then( (resData)=>{
        console.log('resData is: ', resData)
        // this.setState({
        //   dataSource: this.state.dataSource.cloneWithRows(resData)
        // })
      })
      .done();
  }

  // Redirect to Profile Component
  handleGoToProfile(){      // needs to be passed apartment list id!
    this.props.navigator.push({
      title: 'Profile',
      component: Profile,
      // need to pass apartment id to get its info!
    })
  }

  // Logout & Redirect to Login Component
  handleLogout(){
    userRef.unauth();             // Destroys User Auth
    // this.props.navigator.replace({
    //   title: 'Login',
    //   component: Login
    // })
    this.props.navigator.pop();
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
  user: React.PropTypes.object.isRequired
};

module.exports = Homepage;