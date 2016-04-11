'use strict'
const React = require('react-native');
const Firebase = require('firebase');

var Signup = require('./Signup');
var Homepage = require('./Homepage');
var Search = require('./Search');
// var styles = require('./Helpers/Styles');
var ref = new Firebase('https://dazzling-inferno-3629.firebaseio.com/');
var userRef = ref.child('users/');

var BlurView = require('react-native-blur').BlurView;
var VibrancyView = require('react-native-blur').VibrancyView;

var {
  Image,
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
        alert('Oops! Invalid login credentials, please try again!');
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
    this.props.navigator.push({      // use replace???
      title: 'Signup',
      component: Signup,
      leftButtonTitle: ' '
    })
  }

  render(){
    const showError = (
      this.state.error ? <Text>{this.state.error}</Text> : <View />
    );

    return (
      <Image source={{ uri: '../Images/NYC-Traffic.jpg' }} style={styles.menu}>
        <VibrancyView blurType="light" style={styles.blur}>
          <Text>IT WORKSSSSSSS</Text>
        </VibrancyView>
      </Image>   
    )
  }
}

// Blur StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#FFFFFF',
  },
});



module.exports = Login;










