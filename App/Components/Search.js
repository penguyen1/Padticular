'use strict'
const React = require('react-native');
const Firebase = require('firebase');
var styles = require('./Helpers/Styles');
var Homepage = require('./Homepage');
// var YesOrNo = require('./YesOrNo');
// var Nav = require('./Nav');
var ref = new Firebase('https://dazzling-inferno-3629.firebaseio.com/');
var userRef = ref.child('users/');

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

class Search extends React.Component{
  constructor(props) {
    super(props);
    // starts with default values
    this.state = {
      guests: 1,          
      location: '',       
      min_beds: 1,        
      min_bedrooms: '',    
      min_bathrooms: 1,   
      price_max: 10000,
      price_min: 0,     
    };
  }

  componentWillMount(){
    console.log('checking user auth @Search: ', ref.getAuth());
    // ref.getAuth();   // checks user auth state
  }

  // call AirBnB API, get response (must be array!), redirect & pass info to YesOrNo Component
  // **** how do we reset the Search Form fields?? ****
  handleSubmit(){
    // convert this.state values into a valid AirBnB URL parameter string
    // call getListings in api.js and show the response (hopefully as an array)
    // redirect & send (array) response to YesOrNo



    // adding default value ',US' to this.state.location
    // this.setState({ location: this.state.location+",US" })
    console.log('hitting AirBnB API! ', this.state);  
    console.log('min_bedrooms: ', this.state.min_bedrooms)
    var min_bs = parseInt(this.state.min_bedrooms);
    this.setState({ min_bedrooms: min_bs})
    console.log(this.state)
  }

  // Redirect back to Homepage Component
  handleGoBack(){
    this.props.navigator.pop();
  }
  
  render(){
    return(
      <View style={styles.mainContainer}>
        <Text style={styles.title}> Search Form </Text>
        <View style={styles.formContainer}>

        {/* Location Input: Neighborhood, City, State or Zipcode */}
        <TextInput
          style={styles.textInput}
          placeholder="Enter Neighborhood, City, State or Zipcode"
          autoCapitalize="words"
          onChangeText={(text)=>this.setState({ location: text })}
          value={this.state.location} />

        {/* Min number of Bedrooms */}
        <TextInput
          style={styles.textInput}
          placeholder="Minimum number of bedrooms (optional)"
          onChangeText={(text)=>this.setState({ min_bedrooms: text })}
          value={this.state.min_bedrooms} />

          {/* need to move setState in handleSubmit */}
          {/* will take in a str here and  parseInt it later */}
          {/* Or maybe just implement the fucking slider component DUHHHHH */}






        {/* Submit Button */}
        <TouchableHighlight 
          style={styles.button}
          onPress={this.handleSubmit.bind(this)}
          underlayColor="white" >
            <Text style={styles.buttonText}>Search Apt</Text>
        </TouchableHighlight>
      </View>
    </View>
    )
  }
}

Search.propTypes = {
  user: React.PropTypes.object.isRequired
};

module.exports = Search;






