var React = require('react-native');
var Signup = require('./App/Components/Signup');
var Homepage = require('./App/Components/Homepage');

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
