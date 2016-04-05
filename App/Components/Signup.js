'use strict'
const React = require('react-native');
const Firebase = require('firebase');
var Login = require('./Login');
var Homepage = require('./Homepage');
var styles = require('./Helpers/Styles')
var userRef = new Firebase('https://dazzling-inferno-3629.firebaseio.com/');
var users = userRef.child('users');

var {
  Text,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS,
  StyleSheet,
  View,
  Navigator
} = React;


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

  handleSubmit() {
    this.setState({ isLoading: false })

    // user login credentials for Firebase Auth
    var login = {
      email: this.state.email,
      password: this.state.password
    }
    // how to reset the Signup Form??

    // creates new user
    userRef.createUser(login, (error, userData) => {
      //userData contains Firebase user UID ONLY!
      // console.log('userData is: ', userData);
      if(error) {
        alert('Sorry! This email and/or password is already taken!');
      } else {
        users.child(userData.uid).set({
          fullname: this.state.fullname,
          email: this.state.email,
          password: this.state.password
        });
        // authenticates & logs in new user (returns user.uid)
        userRef.authWithPassword(login, (error, authData) => {
          console.log('authData is: ', authData);    // string
          //authData contains UID & token
          if(error){
            alert('Oops! Invalid login credentials, please try again!');
          } else {
            // alert('Welcome. You will be redirected in a few moment.');
            // this.context.setCurrentUserId(authData.uid);
            // this.context.router.push('/user');
            console.log('fullname: ', this.state.fullname);
            console.log('first name only: ', this.state.fullname.split(' ')[0])

            this.props.navigator.push({
              title: 'To: Homepage',
              component: Homepage,
              user: {
                uid: userData.uid,
                name: this.state.fullname
              }
            })
          }
        })
      }
    })
  }

  handleNextRoute() {
    this.props.navigator.push({
      title: 'Login',
      component: Login
    });
  }

  render(){
    const showError = (
      this.state.error ? <Text>{this.state.error}</Text> : <View />
    );

    return (
      <View style={styles.mainContainer}>
        {/*<View style={styles.nav} />*/}
        <View style={styles.formContainer}>
          <Text style={styles.title}> Signup </Text>
          {/* Full Name */}
          <TextInput
            style={styles.textInput}
            placeholder="Enter your full Name"
            onChangeText={(text)=>this.setState({ fullname: text })}
            value={this.state.fullname} />
          {/* Create Username */}
          <TextInput
            style={styles.textInput}
            placeholder="Enter your Email Address"
            onChangeText={(text)=>this.setState({ email: text })}
            value={this.state.email} />
          {/* Create Password */}
          <TextInput
            style={styles.textInput}
            placeholder="Create a Password"
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
          {/* Shows Error Message */}
          {showError}
          {/* Link to Login Component */}
          <View style={styles.footer}>
            <Text>Already a member?</Text>
            <TouchableHighlight 
              onPress={this.handleNextRoute.bind(this)}>
              <Text style={styles.link}>Log In here</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    )
  }
}


module.exports = Signup;
