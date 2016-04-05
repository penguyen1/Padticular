const React = require('react-native');
const Firebase = require('firebase');
// var Search = require('./Search');
var Profile = require('./Profile');
// var Nav = require('./Nav');
var styles = require('./Helpers/Styles');

var {
  Text,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS,
  StyleSheet,
  View,
  Navigator,
  ListView
} = React;

class Homepage extends React.Component{
  handleNextRoute(){
    this.props.navigator.push({
      title: 'Profile',
      component: Profile
    })
  }

  render(){
    return(
      <View style={styles.mainContainer}>
        <Text style={styles.header}>Hello, firstname!</Text>
        <View style={styles.favorites}>
          <Text style={styles.listTitle}>Favorites List</Text>
          <Text style={styles.listFavs}>List of Favorite Apartments here</Text>
          <TouchableHighlight
            style={styles.button}
            onPress={this.handleNextRoute.bind(this)}
            underlayColor='white' >
            <Text style={styles.buttonText}>Go to Profile</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}


module.exports = Homepage;