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
    var token = true;       // temporary replacement for user auth!

    // determines if user token already exists or not
    var goHere = token ? {title: 'Padticular App', component: Homepage}
                       : {title: 'Padticular App', component: Signup}
    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={goHere} />
    );
  }
};

AppRegistry.registerComponent('Padticular', () => Padticular);
