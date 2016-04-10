'use strict'
const React = require('react-native');
const Firebase = require('firebase');

var Login = require('./Login');
var Homepage = require('./Homepage');
var styles = require('./Helpers/Styles');
// var vidStyles = require('./Helpers/VideoStyles');
var userRef = new Firebase('https://dazzling-inferno-3629.firebaseio.com/');
var users = userRef.child('users/');
// var Video = require('react-native-video').default;

var {
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  ActivityIndicatorIOS,
  StyleSheet,
  View,
  Component,
  Navigator
} = React;


// verifies user auth state 
function authDataCallback(authData) {
  console.log( authData ? "@Signup: User is logged in!" : "@Signup: User is logged out!" );
}

class Signup extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      fullname: '',
      email: '',
      password: '',
      isLoading: false,
      error: false
    }
  }

  componentWillMount(){
    userRef.onAuth(authDataCallback);   // checks user auth state
  }

  // **** how do we reset the Signup Form fields?? **** 
  handleSubmit() {
    this.setState({ isLoading: false })

    // user login credentials for Firebase Auth
    var login = {
      email: this.state.email,
      password: this.state.password
    }
    
    // creates new user & returns user's UID (userData.uid)
    userRef.createUser(login, (error, userData) => {

      if(error) {
        alert('Sorry, something went wrong -- Please try again!');
      } else {
        // stores new user info to user's uid in Firebase
        users.child(userData.uid).set({
          fullname: this.state.fullname,
          email: this.state.email
        });

        // authenticate & logs in new user
        userRef.authWithPassword(login, (error, authData) => {
          //authData contains UID & token
          if(error){
            alert('Invalid login credentials -- Please try again');
          } else {
            // Redirect to user Homepage
            this.props.navigator.push({
              title: 'Homepage',
              component: Homepage,
              leftButtonTitle: ' ',
              rightButtonTitle: 'Logout',
              onRightButtonPress: () => {
                ref.unauth();                 // Destroys User Auth
                this.props.navigator.pop();   // go back to previous component - Signup
              },
              passProps: {
                user: {
                  uid: authData.uid,
                  name: this.state.fullname.split(' ')[0]
                }
              }
            })  
          }
        })  
      } // end of else statement
    })  // end of createUser
  }

  // Redirect to Login Component
  handleGoToLogin() {
    this.props.navigator.pop()
  }

  render(){
    const showError = (       // add style??
      this.state.error ? <Text>{this.state.error}</Text> : <View />
    );

    return (
      <View style={styles.mainContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}> Signup </Text>

          {/* Full Name */}
          <TextInput
            style={styles.textInput}
            placeholder="Enter your Full Name"
            autoCapitalize="words"
            autoCorrect={false}
            clearTextOnFocus={true}
            onChangeText={(text)=>this.setState({ fullname: text })}
            value={this.state.fullname} />

          {/* Email Address */}
          <TextInput
            style={styles.textInput}
            placeholder="Enter your Email Address"
            autoCapitalize="none"
            autoCorrect={false}
            clearTextOnFocus={true}
            onChangeText={(text)=>this.setState({ email: text })}
            value={this.state.email} />

          {/* Create Password */}
          <TextInput
            style={styles.textInput}
            placeholder="Create a Password"
            autoCapitalize="none"
            keyboardType="default"
            autoCorrect={false}
            clearTextOnFocus={true}
            secureTextEntry={true}
            onChangeText={(text)=>this.setState({ password: text })}
            value={this.state.password} />

          {/* Submit Button */}
          <TouchableHighlight 
            style={styles.button}
            onPress={this.handleSubmit.bind(this)}
            underlayColor="white" >
              <Text style={styles.buttonText}>Sign Me Up!</Text>
          </TouchableHighlight>

          {/* Loading Spinner */}
          <ActivityIndicatorIOS
            animating={this.state.isLoading}
            color="#111"
            size="large"  />
            {showError}

          {/* Link to Login Component */}
          <View style={styles.footer}>
            <Text>Already a member?</Text>
            <TouchableHighlight 
              onPress={this.handleGoToLogin.bind(this)}>
              <Text style={styles.link}>Log In here</Text>
            </TouchableHighlight>
          </View>

        </View>
      </View>
    )
  }
}


module.exports = Signup;
