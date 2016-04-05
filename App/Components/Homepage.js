const React = require('react-native');
const Firebase = require('firebase');
var styles = require('./Helpers/Styles');
var Profile = require('./Profile');
var Login = require('./Login');
var userRef = new Firebase('https://dazzling-inferno-3629.firebaseio.com/');
// var Search = require('./Search');
// var Nav = require('./Nav');

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
  constructor(props){
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
  }

  componentDidMount() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(????)   // what do i put in here?
    })
  }

  handleNextRoute(){
    // needs to be passed the apartment_id!
    this.props.navigator.push({
      title: 'Profile',
      component: Profile,
    })
  }

  handleLogout(){
    // Destroys User Auth
    userRef.unauth();
    // Redirect to Login Component
    this.props.navigator.replace({
      title: 'To: Login',
      component: Login
    })
  },

  render(){
    return(
      <View style={styles.mainContainer}>
        {/* Homepage Greeting Header */}
        <Text style={styles.header}>Hello, {this.props.user.name}!</Text>
        {/* ListView of User's Favorited Apartments */}
        <View style={styles.favorites}>
          <Text style={styles.listTitle}>Favorites List</Text>
          <Text style={styles.listFavs}>List of Favorite Apartments here</Text>

          {/* Temp 'View' Button to Profile Component */}
          <TouchableHighlight
            style={styles.button}
            onPress={this.handleNextRoute.bind(this)}
            underlayColor='white' >
            <Text style={styles.buttonText}>Go to Profile</Text>
          </TouchableHighlight>

          {/* Temp Logout Button */}
          <TouchableHighlight
            style={styles.button}
            onPress={this.handleLogout.bind(this)}
            underlayColor='white' >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableHighlight>

        </View>
      </View>
    )
  }
}

Homepage.propTypes = {
  user: React.PropTypes.object.isRequired
};

module.exports = Homepage;