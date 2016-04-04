var React = require('react-native');
var styles = require('./Helpers/Styles');
// var Search = require('./Search');
// var Nav = require('./Nav');


var {
  Text,
  View,
  Image,
  TextInput,
  TouchableHighlight,
  Navigator,
  ScrollView
} = React;

class Profile extends React.Component{

  render(){
    return(
      <View style={styles.mainContainer}>
        <Text style={styles.listFavs}>
          Profile Info here
        </Text>
      </View>
    )
  }

};


module.exports = Profile;