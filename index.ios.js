const React = require('react-native');
const Firebase = require('firebase');
var Signup = require('./App/Components/Signup');
var Homepage = require('./App/Components/Homepage');
const userRef = new Firebase('https://dazzling-inferno-3629.firebaseio.com/');
// const user = new Firebase('https://dazzling-inferno-3629.firebaseio.com/users');
const user = userRef.child('users'); 

var {
  AppRegistry,
  StyleSheet,
  NavigatorIOS,
  Navigator
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
    var goHere
    if(userRef.getAuth()){
      var currentuser = userRef.getAuth().uid;
      // gets all users from Firebase
      user.on('value', (snapshot) => {
        console.log('user snapshot! ', snapshot.val()[currentuser])
        goHere = {
          title: 'Homepage', 
          component: Homepage, 
          leftButtonTitle: ' ',
          onLeftButtonPress: () => { console.log('cant ever go back!') },
          passProps: { 
            user: { 
              uid: currentuser,     // user UID
              name: snapshot.val()[currentuser].fullname.split(' ')[0]  // first name
            }
          }
        }
      });
    } else {
      console.log('Whoops! No user currently available.')
      goHere = {
        title: 'Signup', 
        component: Signup,
      }
    }

    return (
      <NavigatorIOS
        style={styles.container}
        translucent={true}
        initialRoute={goHere} />
    )
  }
};

AppRegistry.registerComponent('Padticular', () => Padticular);
