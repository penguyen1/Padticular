const React = require('react-native');
const Firebase = require('firebase');
var Signup = require('./App/Components/Signup');
var Homepage = require('./App/Components/Homepage');
const userRef = new Firebase('https://dazzling-inferno-3629.firebaseio.com/');
const userInfo = new Firebase('https://dazzling-inferno-3629.firebaseio.com/users');
// var users = userRef.child('users');

var {
  AppRegistry,
  StyleSheet,
  NavigatorIOS,
  ListView
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111'
  }
});

class Padticular extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      user: ''
    };
    // this.favsRef = new Firebase("https://dazzling-inferno-3629.firebaseio.com/items");
  }

  componentWillMount(){
    console.log('userRef.getAuth() is: ', userRef.getAuth())
    if(userRef.getAuth()){
      var currentuser = userRef.getAuth().uid;
      userInfo.on('value', (snapshot) => {
        console.log('snapshot! ', snapshot)
        // this.setState({user: snapshot.val()[currentuser].firstname})
      });
    } else {
      console.log('WHOMP, No user auth!')
      // this.setState({user: ''});
    }
  }

  render() {
    var token = false;       // temporary replacement for user auth!
    // var token = true;

    // determines if user token already exists or not
    var goHere = token ? {title: 'Padticular', component: Homepage}
                       : {title: 'Welcome to Padticular!', component: Signup}
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={goHere} />
    );
  }
};

AppRegistry.registerComponent('Padticular', () => Padticular);
