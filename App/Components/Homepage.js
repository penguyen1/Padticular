var React = require('react-native');
// var Search = require('./Search');
// var Profile = require('./Profile');
// var Nav = require('./Nav');
var styles = require('./Helpers/Styles');

var {
  Text,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS,
  StyleSheet,
  View,
  Navigator
} = React;

class Homepage extends React.Component{
  render(){
    return(
      <View style={styles.mainContainer}>
        <Text style={styles.header}>Hello, firstname!</Text>
        <View style={styles.favorites}></View>
      </View>
    )
  }
}


module.exports = Homepage;