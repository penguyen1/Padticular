'use strict'
const React = require('react-native');
const Firebase = require('firebase');
var Signup = require('./Signup');
var Homepage = require('./Homepage');
// var Separator = require('./Helpers/Separator');
var styles = require('./Helpers/Styles');
var ref = new Firebase('https://dazzling-inferno-3629.firebaseio.com/');
var userRef = ref.child('users/');

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

class Login extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      email: '',
      password: '',
      isLoading: false,
      error: false
    }
  }

  componentWillMount(){
    // user auth exists - but WHO??
    if(ref.getAuth()){
      // this.props.navigator.jumpBack();
      var user = userRef.child(ref.getAuth().uid)

      user.once('value', (snapshot)=>{
        var firstname = snapshot.val().fullname.split(' ')[0]
        console.log('SNAPSHOT BABY: ', firstname)

        // save info (firstname + uid) & redirect to Homepage         // DRY THIS LATER
        this.props.navigator.push({     // WHY ISNT THIS WORKING!!
          title: 'Homepage',
          component: Homepage,
          passProps: {
            user: {
              uid: ref.getAuth().uid,
              name: firstname
            }
          }
        })
      })    // end of user.once

    }
  }

  handleSubmit() {
    this.setState({ isLoading: false })
    var login = {
      email: this.state.email,
      password: this.state.password
    }
    // how do we reset the Login Form fields??

    // authenticates & logs in returning user
    ref.authWithPassword(login, (error, authData) => {
      //authData contains UID!!
      console.log('authData.uid @Login: ', authData.uid);    // string
      if(error || !authData){
        alert('Oops! Invalid login credentials, please try again!');
      } else {
        userRef.once('value', (snapshot)=>{
          var member = snapshot.val()[authData.uid];
          var firstname = member.fullname.split(' ')[0]

          this.props.navigator.push({
            title: 'Homepage', 
            component: Homepage, 
            passProps: { 
              user: { 
                uid: authData.uid,
                name: firstname  // user's first name
              }
            }
          })
        })
      }     // end if-else statement
    })
  }

  // Redirect to Signup Component
  handleGoToSignup() {
    // this.props.navigator.replace({
    //   title: 'Signup',
    //   component: Signup
    // });
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
              onPress={this.handleGoToSignup.bind(this)}>
              <Text style={styles.link}>Sign up here</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    )
  }
}


module.exports = Login;









