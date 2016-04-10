'use strict'
const React = require('react-native');
const Firebase = require('firebase');
const t = require('tcomb-form-native');

var Signup = require('./Signup');
var Homepage = require('./Homepage');
var Search = require('./Search');
// var styles = require('./Helpers/Styles');
var ref = new Firebase('https://dazzling-inferno-3629.firebaseio.com/');
var userRef = ref.child('users/');

// tcomb-form-native -- source: https://github.com/gcanti/tcomb-form-native
var Form = t.form.Form;

// To create forms -- Source: https://github.com/FaridSafi/react-native-gifted-form
// var {
//   GiftedForm, 
//   GiftedFormManager
// } = require('react-native-gifted-form');

var {
  Text,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS,
  StyleSheet,
  View,
  Navigator
} = React;




// defining the domain model
var Login = t.struct({
  email: t.String,        // required string
  password: t.String,     // required string
});
var options = {};   // optional rendering options (see documentation)


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


  onPress() {
    // call getValue() to get the values of the form
    var value = this.refs.form.getValue();
    if (value) { // if validation fails, value will be null
      console.log('Testing Login Values: ', value); // value here is an instance of Login
    } else {
      console.log('NO LOGIN MET')
    }
  },

  render() {
    const showError = (
      this.state.error ? <Text>{this.state.error}</Text> : <View />
    );

    return (
      <View style={styles.container}>
        {/* display */}
        <Form
          ref="form"
          type={Login}
          options={options} />

        <TouchableHighlight style={styles.button} onPress={this.onPress} underlayColor='#99d9f4'>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableHighlight>
      </View>
    );
  }

} // end of Login Component


// tcomb StyleSheet
var styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 30,
    alignSelf: 'center',
    marginBottom: 30
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});




module.exports = Login;


//  ORIGINAL LOGIN LAYOUT -- ugly 

// return (
//       <View style={styles.mainContainer}>
//         <View style={styles.formContainer}>
//           <Text style={styles.title}> Login </Text>

//           {/* Email Address */}
//           <TextInput
//             style={styles.textInput}
//             placeholder="Email Address"
//             autoCapitalize="none"
//             autoCorrect={false}
//             clearTextOnFocus={true}
//             onChangeText={(text)=>this.setState({ email: text})}
//             value={this.state.email} />

//           {/* Password */}
//           <TextInput
//             style={styles.textInput}
//             placeholder="Password"
//             autoCapitalize="none"
//             autoCorrect={false}
//             secureTextEntry={true}
//             clearTextOnFocus={true}
//             onChangeText={(text)=>this.setState({ password: text})}
//             value={this.state.password} />

//           {/* Login Button */}
//           <TouchableHighlight 
//             style={styles.button}
//             onPress={this.handleSubmit.bind(this)}
//             underlayColor="white" >
//               <Text style={styles.buttonText}>Login</Text>
//           </TouchableHighlight>

//           {/* Spinning Status */}
//           <ActivityIndicatorIOS
//             animating={this.state.isLoading}
//             color="#111"
//             size="large"  />
//           {showError}

//           {/* Link to Signup Component */}
//           <View style={styles.footer}>
//             <Text>Not a member?</Text>
//             <TouchableHighlight 
//               onPress={this.handleGoToSignup.bind(this)}>
//               <Text style={styles.link}>Sign up here</Text>
//             </TouchableHighlight>
//           </View>
//         </View>
//       </View>
//     )








