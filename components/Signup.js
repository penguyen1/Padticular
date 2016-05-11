'use strict'
const React = require('react-native');
var { Stylesheet, Text, View } = React;
const Button = require('react-native-button');

// Database connection to Firebase
const Firebase = require('firebase');
const userRef = new Firebase('https://dazzling-inferno-3629.firebaseio.com');
const user = userRef.child('/users'); 

// Signup component - registration form for new members
class Signup extends React.Component {
  
  // need methods to create & verify new member info in Firebase!
  // need to create Registration form with TextInput fields for: Full Name, Email & Create Password!

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

// Styling for Intro component page
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


