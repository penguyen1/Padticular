'use strict'
const React = require('react-native');
const Button = require('react-native-button');
var { 
  Dimensions, 
  Image, 
  Stylesheet, 
  Text, 
  TextInput, 
  TouchableHighlight, 
  View 
} = React;
var IMAGE_WIDTH = Dimensions.get('window').width;
var IMAGE_HEIGHT = Dimensions.get('window').height;
// console.log('Login width: ', IMAGE_WIDTH)
// console.log('Login height: ', IMAGE_HEIGHT)

// Database connection to Firebase
const Firebase = require('firebase');
const userRef = new Firebase('https://dazzling-inferno-3629.firebaseio.com');
const user = userRef.child('/users'); 

// Login component - login form for registered members
class Login extends React.Component {

  // need methods to verify member info from Firebase!
  // need to create Login form with TextInput fields for: Email & Password!
  
  // if user info is verified (exists), set state (dispatch store?) with user info & replace with Homepage component
  // else, display error popup: "Uh oh! Invalid email and/or password. Please try again." & reset form fields

  render() {
    let Actions = this.props.routes;      // what info is inside this.props.routes?? is info passed from Signup, Intro or index.ios.js? 

    return (
      <View style={styles.container}>
        <Text>Welcome back!</Text>
        <Button onPress={Actions.homepage}>Login</Button>
        <Button onPress={Actions.pop}>Back</Button>
      </View>
    )
  }
}


// Styling for Login page
var styles = Stylesheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

module.exports = Login;


