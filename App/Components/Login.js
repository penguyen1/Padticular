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

        // save info (firstname + uid) & redirect to Homepage         // DRY THIS LATER
        this.props.navigator.push({ 
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

  // how do we reset the Login Form fields??
  handleSubmit() {
    this.setState({ isLoading: false })
    var login = {
      email: this.state.email,
      password: this.state.password
    }

    // authenticate & logs in returning user -- authData contains UID!!
    ref.authWithPassword(login, (error, authData) => {
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

          {/* Email Address */}
          <TextInput
            style={styles.textInput}
            placeholder="Email Address"
            autoCapitalize="none"
            autoCorrect={false}
            clearTextOnFocus={true}
            onChangeText={(text)=>this.setState({ email: text})}
            value={this.state.email} />

          {/* Password */}
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            clearTextOnFocus={true}
            onChangeText={(text)=>this.setState({ password: text})}
            value={this.state.password} />

          {/* Login Button */}
          <TouchableHighlight 
            style={styles.button}
            onPress={this.handleSubmit.bind(this)}
            underlayColor="white" >
              <Text style={styles.buttonText}>Login</Text>
          </TouchableHighlight>

          {/* Spinning Status */}
          <ActivityIndicatorIOS
            animating={this.state.isLoading}
            color="#111"
            size="large"  />
          {showError}

          {/* Link to Signup Component */}
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










