'use strict'
var React = require('react-native');
var Main = require('./App/Components/Main');
var Test = require('./App/Components/Test');

var {
  AppRegistry,
  StyleSheet,
  NavigatorIOS
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111'
  },
  wrapper: {
    flex: 1,
  }
});

class Padticular extends React.Component{
  render() {
    return (
      <NavigatorIOS
        style={styles.wrapper}
        initialRoute={{
          title: 'Padticular App',
          component: Test
        }} />
    );
  }
};

module.exports = Padticular;
AppRegistry.registerComponent('Padticular', () => Padticular);
