'use strict'
const React = require('react-native');
const Firebase = require('firebase');
var Signup = require('./Signup');
var Homepage = require('./Homepage');
// var Separator = require('./Helpers/Separator');
var styles = require('./Helpers/Styles');
var ref = new Firebase('https://dazzling-inferno-3629.firebaseio.com/');
var userRef = new Firebase('https://dazzling-inferno-3629.firebaseio.com/users');

var {
  Text,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS,
  StyleSheet,
  View,
  Navigator
} = React;


function authDataCallback(authData) {
  if (authData) {
    console.log("User is logged in!");
  } else {
    console.log("User is logged out!");
  }
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

    console.log('checking user auth @Login: ', ref.onAuth(authDataCallback));   // checks user auth state
  }

  handleSubmit() {
    this.setState({ isLoading: false })
    // console.log('You entered: ', this.state)
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
        // var yo = userRef.child(authData.uid)
        // console.log('user data: ', yo.val())

        // userRef.once('value', (authData.uid)=>{})
        userRef.once('value', (snapshot)=>{
          var member = snapshot.val()[authData.uid];
          var first = member.fullname.split(' ')[0]
          console.log('member: ', member)
          console.log('firstname: ', first)

          this.props.navigator.push({
            title: 'Homepage', 
            component: Homepage, 
            passProps: { 
              user: { 
                uid: authData.uid,
                name: first  // user's first name
              }
            }
          })

        })

        // userRef.on('value', (snapshot) => {
        //   // snapshot.forEach((user) => console.log('A user snapshot: ', user))
        //   console.log('snapshot: ', snapshot.val())
        //   console.log('user snapshot: ', snapshot.val()[authData.uid])
          
          
        //   // var firstname = snapshot.val()[authData.uid].fullname.split(' ')[0]  // user's first name
        //   // console.log('Login - first name: ', firstname)

        //   // this.props.navigator.push({
        //   //   title: 'Homepage', 
        //   //   component: Homepage, 
        //   //   passProps: { 
        //   //     user: { 
        //   //       name: snapshot.val()[authData.uid].fullname.split(' ')[0]  // user's first name
        //   //     }
        //   //   }
        //   // })
        // });
      }
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









