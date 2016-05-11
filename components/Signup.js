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
// console.log('Signup width: ', IMAGE_WIDTH)
// console.log('Signup height: ', IMAGE_HEIGHT)

// Database connection to Firebase
const Firebase = require('firebase');
const userRef = new Firebase('https://dazzling-inferno-3629.firebaseio.com');
const user = userRef.child('/users'); 

// Signup component - registration form for new members
class Signup extends React.Component {
  
  // need methods to verify & create new member info in Firebase!
  // need to create Registration form with TextInput fields for: Full Name, Email & Create Password!
  
  // if user info is valid (not repeated), add user to Firebase & redirect to Login component
  // else, display error popup: "Oops! That email is already taken - please try again!" & reset form fields 

  render() {
    let Actions = this.props.routes;      // what info is inside this.props.routes??

    return (
      <View style={styles.container}>
        <Text>New Member Registration</Text>
        <Button onPress={Actions.login}>Sign me up!</Button>
        <Button onPress={Actions.pop}>Back</Button>
      </View>
    )
  }
}


// Styling for Signup page
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

module.exports = Signup;


