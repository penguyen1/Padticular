'use strict'
const React = require('react-native');
const Firebase = require('firebase');

var Login = require('./Login');
var Homepage = require('./Homepage');
var userRef = new Firebase('https://dazzling-inferno-3629.firebaseio.com/');
var users = userRef.child('users/');

var {
  Dimensions,
  Image,
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
var IMAGE_WIDTH = Dimensions.get('window').width;
var IMAGE_HEIGHT = Dimensions.get('window').height;
// console.log('login width: ', IMAGE_WIDTH)
// console.log('login height: ', IMAGE_HEIGHT)

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
        alert('Sorry, I didnt get that -- Please try again!');
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
    this.props.navigator.resetTo({
      title: 'Login',
      component: Login,
      leftButtonTitle: ' '
    })
    // this.props.navigator.popToTop()
  }

  render(){
    const showError = (
      this.state.error ? <Text style={styles.errorMsg}>{this.state.error}</Text> : <Text style={styles.errorMsg}></Text>
    );

    return (
      <Image source={require('./Images/NYC2.jpg')} style={styles.backgroundImage} >
        <View style={styles.container}>
          <Text style={styles.welcome}>Welcome to Padticular!</Text>

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
            onChangeText={(text)=>this.setState({ email: text})}
            value={this.state.email} />

          {/* Create Password */}
          <TextInput
            style={styles.textInput}
            placeholder="Create a Password"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            clearTextOnFocus={true}
            onChangeText={(text)=>this.setState({ password: text})}
            value={this.state.password} />

          {/* Submit Button */}
          <TouchableHighlight 
            style={styles.button}
            onPress={this.handleSubmit.bind(this)}
            underlayColor="#e99695" >
              <Text style={styles.buttonText}>Sign me up!</Text>
          </TouchableHighlight>

          {/* Loading Status */}
          <ActivityIndicatorIOS
            animating={this.state.isLoading}
            color="#111"
            size="large"  />
          {showError}

          {/* Link to Login Component */}
          <View style={styles.footer}>
            <Text style={styles.question}>Already a member?</Text>
            <TouchableHighlight 
              onPress={this.handleGoToLogin.bind(this)}>
              <Text style={styles.link}>Login here</Text>
            </TouchableHighlight>
          </View>

        </View>
      </Image>  
    )
  }
}

// Signup StyleSheet
var styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
  },
  container: {              // view
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.7)',
    marginTop: 110,
    marginLeft: 27,
    borderRadius: 11,
    width: 330,
    height: 450
  },
  welcome: {             
    position: 'relative',
    backgroundColor: 'transparent',
    fontSize: 37,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
    height: 80,
    color: 'white',
  },
  textInput: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'white',
    opacity: 0.6,
    height: 50,
    padding: 2,
    marginTop: 10,
    fontSize: 18,
    borderWidth: 0.4,
    borderColor: 'black',
    color: 'black',
    textAlign: 'center',
  },
  buttonText: {
    fontSize: 22,
    // fontWeight: 'bold',
    color: 'black',
    alignSelf: 'center'
  },
  button: {
    position: 'relative',
    backgroundColor: '#99ff99',
    height: 45,
    width: 150,
    borderWidth: 0.3,
    borderRadius: 11,
    marginTop: 20,
    marginLeft: 88,
    marginBottom: -20,
    justifyContent: 'center'
  },
  errorMsg: {
    position: 'relative',
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 20,
    color: 'red',
  },
  footer: {
    position: 'relative',
    backgroundColor: 'transparent',
    marginLeft: 99,
    marginBottom: 10,
    top: -6
  },
  question: {
    color: 'white',
  },
  link: {
    color: 'red',
    marginLeft: 28
  },
});

module.exports = Signup;
