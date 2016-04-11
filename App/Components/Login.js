'use strict'
const React = require('react-native');
const Firebase = require('firebase');
var Signup = require('./Signup');
var Homepage = require('./Homepage');
var Search = require('./Search');
var ref = new Firebase('https://dazzling-inferno-3629.firebaseio.com/');
var userRef = ref.child('users/');

var {
  Dimensions,
  Image,
  Text,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS,
  StyleSheet,
  View,
  Navigator
} = React;
var IMAGE_WIDTH = Dimensions.get('window').width;
var IMAGE_HEIGHT = Dimensions.get('window').height;
// console.log('login width: ', IMAGE_WIDTH)
// console.log('login height: ', IMAGE_HEIGHT)

class Login extends React.Component {
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
      var user = userRef.child(ref.getAuth().uid)
      user.once('value', (snapshot)=>{
        var firstname = snapshot.val().fullname.split(' ')[0]

        // save info (firstname + uid) & redirect to Homepage         // DRY THIS LATER
        this.props.navigator.push({ 
          title: 'Homepage',
          component: Homepage,
          leftButtonTitle: 'Find Apartments',
          onLeftButtonPress: () => { console.log('lets find you an apartment!') },
          rightButtonTitle: 'Logout',
          onRightButtonPress: () => { console.log('Logging yo ass out!') },
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
        // alert('Oops! Invalid login credentials, please try again!');
        this.props.navigator.popToTop();
      } else {
        userRef.once('value', (snapshot)=>{
          var member = snapshot.val()[authData.uid];
          var firstname = member.fullname.split(' ')[0]

          this.props.navigator.push({
            title: 'Homepage', 
            component: Homepage, 
            leftButtonTitle: ' ',
            rightButtonTitle: 'Logout',
            onRightButtonPress: () => {
              ref.unauth();                 // Destroys User Auth
              this.props.navigator.popToTop();   // go back to previous component - Signup
            },
            passProps: { 
              user: { 
                uid: authData.uid,
                name: firstname,  // user's first name
                start: this.props.navigator.navigationContext._currentRoute
              }
            }
          })

        })
      }     // end if-else statement
    })
  }

  // Redirect to Signup Component
  handleGoToSignup() {
    this.props.navigator.replace({ 
      title: 'Signup',
      component: Signup,
      leftButtonTitle: ' ',
      passProps: {
        start: this.props.navigator.navigationContext._currentRoute
      }
    })
  }

  // handles Password input
  handlePassword(e){
    this.setState({
      password: e.nativeEvent.text
    })
  }

  // handles Email input
  handleEmail(e){
    this.setState({
      email: e.nativeEvent.text
    })
  }

  render() {
    const showError = (
      this.state.error ? <Text style={styles.errorMsg}>{this.state.error}</Text> : <Text style={styles.errorMsg}></Text>
    );

    return (
      <Image source={require('./Images/NYC2.jpg')} style={styles.backgroundImage} >
        <View style={styles.container}>
          <Text style={styles.welcome}>Hello again!</Text>
 
         {/* Email Address */}
          <TextInput
            style={styles.textInput}
            placeholder="Email Address"
            autoCapitalize="none"
            autoCorrect={false}
            clearTextOnFocus={true}
            value={this.state.email} 
            onChange={this.handleEmail.bind(this)} />

          {/* Password */}
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            clearTextOnFocus={true}
            value={this.state.password}
            onChange={this.handlePassword.bind(this)} />

          {/* Login Button */}
          <TouchableHighlight 
            style={styles.button}
            onPress={this.handleSubmit.bind(this)}
            underlayColor="#e99695" >
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
            <Text style={styles.question}>Not a member?</Text>
            <TouchableHighlight 
              onPress={this.handleGoToSignup.bind(this)}>
              <Text style={styles.link}>Sign up here</Text>
            </TouchableHighlight>
          </View>

        </View>
      </Image>   
    )
  }
} // end of Login Component

// Login StyleSheet
var styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
  },
  container: {              // view
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.6)',
    marginTop: 140,
    marginLeft: 27,
    borderRadius: 11,
    width: 330,
    height: 400
  },
  welcome: {             
    position: 'relative',
    backgroundColor: 'transparent',
    fontSize: 52,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    height: 70,
    color: 'white',
  },
  textInput: {
    position: 'relative',
    backgroundColor: 'white',
    opacity: 0.6,
    height: 50,
    paddingLeft: 10,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 18,
    borderWidth: 0.4,
    borderRadius: 4,
    borderColor: 'black',
    color: 'black',
    textAlign: 'center',
  },
  buttonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    alignSelf: 'center'
  },
  button: {
    position: 'relative',
    backgroundColor: '#99ff99',
    height: 45,
    width: 120,
    borderWidth: 0.3,
    borderRadius: 20,
    marginTop: 20,
    marginLeft: 103,
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
    marginLeft: 113,
    marginBottom: 10,
    top: -6
  },
  question: {
    color: 'white',
  },
  link: {
    color: 'red',
    marginLeft: 7
  },
});

module.exports = Login;





