'use strict'
const React = require('react-native');
const Firebase = require('firebase');
var Signup = require('./Signup');
var Homepage = require('./Homepage');
// var Separator = require('./Helpers/Separator');
var styles = require('./Helpers/Styles');
var userRef = new Firebase('https://dazzling-inferno-3629.firebaseio.com/');
var userInfo = new Firebase('https://dazzling-inferno-3629.firebaseio.com/users');

var {
  Text,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS,
  StyleSheet,
  View,
  Navigator
} = React;

class Login extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      username: '',
      password: '',
      isLoading: false,
      error: false
    }
  }

  handleSubmit() {
    this.setState({ isLoading: false })
    // console.log('You entered: ', this.state)
    var login = {
      email: this.state.email,
      password: this.state.password
    }
    // how do we reset the Login Form??

    // authenticates & logs in returning user
    userRef.authWithPassword(login, (error, authData) => {
      //authData contains UID!!
      console.log('LOGIN authData is: ', authData.uid);    // string
      if(error){
        alert('Oops! Invalid login credentials, please try again!');
      } else {

        // console.log('fullname: ', this.state.fullname);
        // console.log('first name only: ', this.state.fullname.split(' ')[0])

        // // Redirect to Homepage with user info
        // this.props.navigator.push({
        //   title: 'Login to Homepage',
        //   component: Homepage,
        //   passProps: {
        //     user: {
        //       uid: userData.uid,
        //       // name: this.state.fullname
        //       // need to pass user info! -- user: {}
        //     }
        //   }
        // }) 

        userInfo.on('value', (snapshot) => {
          // console.log('userInfo snapshot! ', snapshot.val()[authData.uid])
          console.log('LOGIN user uid: ', authData.uid);
          console.log('LOGIN user first name: ', snapshot.val()[authData.uid].fullname.split(' ')[0])
          this.props.navigator.push({
            title: 'Login to Homepage', 
            component: Homepage, 
            passProps: { 
              user: { 
                uid: authData.uid,     // user UID
                name: snapshot.val()[authData.uid].fullname.split(' ')[0]  // user's first name
              }
            }
          })
        });


      }
    })
  }

  handleNextRoute() {
    this.props.navigator.pop()
  }

  render(){
    const showError = (
      this.state.error ? <Text>{this.state.error}</Text> : <View />
    );

    return (
      <View style={styles.mainContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}> Login </Text>
          {/* <Separator /> */}
          <TextInput
            style={styles.textInput}
            placeholder="Email Address"
            onChangeText={(text)=>this.setState({ email: text})}
            value={this.state.email} />
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            onChangeText={(text)=>this.setState({ password: text})}
            value={this.state.password} />

          <TouchableHighlight 
            style={styles.button}
            onPress={this.handleSubmit.bind(this)}
            underlayColor="white" >
              <Text style={styles.buttonText}>Login</Text>
          </TouchableHighlight>
          <ActivityIndicatorIOS
            animating={this.state.isLoading}
            color="#111"
            size="large"  />
          {showError}
          <View style={styles.footer}>
            <Text>Not a member?</Text>
            <TouchableHighlight 
              onPress={this.handleNextRoute.bind(this)}>
              <Text style={styles.link}>Sign up here</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    )
  }
}


module.exports = Login;









