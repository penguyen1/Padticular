const React = require('react-native');
const Firebase = require('firebase');
var Signup = require('./App/Components/Signup');
var Homepage = require('./App/Components/Homepage');
const userRef = new Firebase('https://dazzling-inferno-3629.firebaseio.com/');
const userInfo = new Firebase('https://dazzling-inferno-3629.firebaseio.com/users');

var {
  AppRegistry,
  StyleSheet,
  NavigatorIOS
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111'
  }
});

class Padticular extends React.Component{
  render() {
    // console.log('userRef.getAuth() is: ', userRef.getAuth())
    if(userRef.getAuth()){
      var currentuser = userRef.getAuth().uid;
      // gets all users from Firebase
      userInfo.on('value', (snapshot) => {
        console.log('userInfo snapshot! ', snapshot.val()[currentuser])
        var goHere = {
          title: 'index to Homepage', 
          component: Homepage, 
          passProps: { 
            user: { 
              uid: currentuser,     // user UID
              name: snapshot.val()[currentuser].fullname.split(' ')[0]  // user's first name
            }
          }
        }
      });
    } else {
      console.log('Whoops! No user currently available.')
      var goHere = {title: 'index to Signup', component: Signup}
    }

    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={goHere} />
    )
  }
};

AppRegistry.registerComponent('Padticular', () => Padticular);
