'use strict'
const React = require('react-native');
const Firebase = require('firebase');
const NumericInput = require('react-numeric-input');
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
      min_bedrooms: 0,    
      min_bathrooms: 1,   
      price_max: 10000,
      price_min: 0,     
    }
  }

  componentWillMount(){
    console.log('checking user auth @Search: ', ref.getAuth());
    // ref.getAuth();   // checks user auth state
  }

  // get AirBnB response (needs to be an array!) & pass it to YesOrNo Component
  handleSubmit() {
    // convert this.state values into a valid AirBnB URL parameter string
    // call getListings in api.js and show the response (hopefully as an array)
    // redirect & send (array) response to YesOrNo

    // how do we reset the Search Form fields??
    console.log('hitting AirBnB API! ', this.state);
  }

  // Redirect back to Homepage Component
  handleGoBack() {
    this.props.navigator.pop();
  }

  render(){
    return (
      <View style={styles.mainContainer}>
        {/*<View style={styles.nav} />*/}
        <View style={styles.formContainer}>
          <Text style={styles.title}> Find Me An Apartment </Text>

          {/* Location Input: Neighborhood, City, Zipcode */}
          <TextInput
            style={styles.textInput}
            placeholder="Enter a Neighborhood, City or Zipcode"
            onChangeText={(text)=>this.setState({ location: text+' US' })}
            value={this.state.location} />
          {/* Dropdown Menu for States */}

          {/* Min number of Bedrooms */}
          <NumericInput
            style={styles.textInput}
            placeholder="Enter min number of bedrooms (optional)"
            onChange={(valueAsNumber)=>this.setState({ min_bedrooms: valueAsNumber })}
            onInvalid={(errorMessage)=>console.log('ERROR @min_bedrooms: ', errorMessage)}
            value={this.state.min_bedrooms} />
          {/* Min number of Bathrooms */}
          <NumericInput
            style={styles.textInput}
            placeholder="Enter min number of bathrooms (optional)"
            onChange={(valueAsNumber)=>this.setState({ min_bathrooms: valueAsNumber })}
            onInvalid={(errorMessage)=>console.log('ERROR @min_bathrooms: ', errorMessage)}
            value={this.state.min_bathrooms} />
          {/* Min number of Beds */}
          <NumericInput
            style={styles.textInput}
            placeholder="Enter min number of beds (optional)"
            onChange={(valueAsNumber)=>this.setState({ min_beds: valueAsNumber })}
            onInvalid={(errorMessage)=>console.log('ERROR @min_beds: ', errorMessage)}
            value={this.state.min_beds} />
          {/* Number of Guests */}
          <NumericInput
            style={styles.textInput}
            placeholder="Enter number of guests (optional)"
            onChange={(valueAsNumber)=>this.setState({ min_beds: valueAsNumber })}
            onInvalid={(errorMessage)=>console.log('ERROR @num_guests: ', errorMessage)}
            value={this.state.min_beds} />
          {/* Minimum Price */}
          <NumericInput
            style={styles.textInput}
            placeholder="Enter Minimum Price"
            onChange={(valueAsNumber)=>this.setState({ price_min: valueAsNumber })}
            onInvalid={(errorMessage)=>console.log('ERROR @min_price: ', errorMessage)}
            value={this.state.price_min} />
          {/* Maximum Price */}
          <NumericInput
            style={styles.textInput}
            placeholder="Enter Maximum Price"
            onChange={(valueAsNumber)=>this.setState({ price_max: valueAsNumber })}
            onInvalid={(errorMessage)=>console.log('ERROR @max_price: ', errorMessage)}
            value={this.state.price_max} />


          {/* Submit Button */}
          <TouchableHighlight 
            style={styles.button}
            onPress={this.handleSubmit.bind(this)}
            underlayColor="white" >
              <Text style={styles.buttonText}>Find Apartment!</Text>
          </TouchableHighlight>

          {/* Link to Homepage Component */}
          <TouchableHighlight 
            style={styles.button}
            onPress={this.handleGoBack.bind(this)}
            underlayColor="white" >
            <Text style={styles.buttonText}>Back to Homepage</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
};

Search.propTypes = {
  user: React.PropTypes.object.isRequired
};

module.exports = Search;






