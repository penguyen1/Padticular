'use strict'
const React = require('react-native');
const Firebase = require('firebase');
var Login = require('./Login');
var Homepage = require('./Homepage');
var styles = require('./Helpers/Styles')
var userRef = new Firebase('https://dazzling-inferno-3629.firebaseio.com/');
var users = userRef.child('users/');

var {
  Text,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS,
  StyleSheet,
  View,
  Navigator
} = React;

// verifies user auth state 
function authDataCallback(authData) {
  console.log( authData ? "User is logged in!" : "User is logged out!" );
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

  handleSubmit() {
    this.setState({ isLoading: false })

    // user login credentials for Firebase Auth
    var login = {
      email: this.state.email,
      password: this.state.password
    }
    // how do we reset the Signup Form fields??
    
    // creates new user
    userRef.createUser(login, (error, userData) => {
      //userData contains Firebase user UID ONLY!
      if(error) {
        alert('Sorry, something went wrong -- Please try again!');
      } else {
        users.child(userData.uid).set({
          fullname: this.state.fullname,
          email: this.state.email
        });
        // authenticates & logs in new user (returns user.uid)
        userRef.authWithPassword(login, (error, authData) => {
          //authData contains UID & token
          console.log('authData is: ', authData.uid);    // string
          if(error){
            alert('Invalid login credentials -- Please try again');
          } else {
            // Redirect to Homepage with user info
            this.props.navigator.push({
              title: 'Homepage',
              component: Homepage,
              passProps: {
                user: {
                  uid: authData.uid,
                  name: this.state.fullname.split(' ')[0]
                }
              }
            })  
          }
        })  // ends user authentication
      }   
    })  // ends createUser
  }

  // Redirect to Login Component
  handleGoToLogin() {
    this.props.navigator.push({      // replace???
      title: 'Login',
      component: Login
    });
  }

  render(){
    const showError = (       // style Text?
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
            onChangeText={(text)=>this.setState({ fullname: text })}
            value={this.state.fullname} />

          {/* Email Address */}
          <TextInput
            style={styles.textInput}
            placeholder="Enter your Email Address"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(text)=>this.setState({ email: text })}
            value={this.state.email} />

          {/* Create Password */}
          <TextInput
            style={styles.textInput}
            placeholder="Create a Password"
            autoCapitalize="none"
            keyboardType="default"
            autoCorrect={false}
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
