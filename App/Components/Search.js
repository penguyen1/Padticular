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
    this.state = {
      guests: '',          
      location: '',       // default: US - specification to US only
      min_beds: '',       
      min_bedrooms: '',   // default: 0  
      min_bathrooms: '',  // default: 0   
      price_max: '',      // default: 10000
      price_min: '',      // default: 0
    };
  }

  componentWillMount(){
    console.log('checking user auth @Search: ', ref.getAuth());
    // ref.getAuth();   // checks user auth state
  }



  // call AirBnB API, get response (must be array!), redirect & pass info to YesOrNo Component
  // **** how do we reset the Search Form fields?? ****
  handleSubmit(){
    this.setState({ location: this.state.location+",US" })    // search specification to US only
    console.log('about to hit that AirBnB API!', this.state);

    // convert this.state values into a valid AirBnB URL parameter string
    var params = Object.keys(this.state).map((el)=>{
      return( this.state[el].length ? `&${el}=${this.state[el]}` : '' )
    }).join('')

    // call getListings in api.js and show the response (hopefully as an array)
    // redirect & send (array) response to YesOrNo


    // this.setState({ location: this.state.location+",US" })
    console.log('about to hit it with this:  ', params);  
    // console.log('min_bedrooms: ', typeof(this.state.min_bedrooms))
    // var min_bs = parseInt(this.state.min_bedrooms);
    // this.setState({ min_bedrooms: min_bs})
    // console.log(this.state)
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
          clearTextOnFocus={true}
          onChangeText={(text)=>this.setState({ location: text })}
          value={this.state.location} />

          {/* need to move setState in handleSubmit */}
          {/* will take in a str here and  parseInt it later */}
          {/* Or maybe just implement the slider component, DUHHHHH */}

        {/* Min number of Bedrooms */}
        <TextInput
          style={styles.textInput}
          placeholder="Min number bedrooms (optional)"
          clearTextOnFocus={true}
          onChangeText={(text)=>this.setState({ min_bedrooms: text })}
          value={this.state.min_bedrooms} />


        {/* Min number of Bathrooms */}
        <TextInput
          style={styles.textInput}
          placeholder="Min number bathrooms (optional)"
          clearTextOnFocus={true}
          onChangeText={(text)=>this.setState({ min_bathrooms: text })}
          value={this.state.min_bathrooms} />
        {/* Min number of Beds */}
        <TextInput
          style={styles.textInput}
          placeholder="Min number beds (optional)"
          clearTextOnFocus={true}
          onChangeText={(text)=>this.setState({ min_beds: text })}
          value={this.state.min_beds} />


        {/* Number of Guests */}
        <TextInput
          style={styles.textInput}
          placeholder="Number of guests (optional)"
          clearTextOnFocus={true}
          onChangeText={(text)=>this.setState({ guests: text })}
          value={this.state.guests} />


        {/* Minimum Price */}
        <TextInput
          style={styles.textInput}
          placeholder="Enter Min Price"
          clearTextOnFocus={true}
          onChangeText={(text)=>this.setState({ price_min: text })}
          value={this.state.price_min} />
        {/* Maximum Price */}
        <TextInput
          style={styles.textInput}
          placeholder="Enter Max Price"
          clearTextOnFocus={true}
          onChangeText={(text)=>this.setState({ price_max: text })}
          value={this.state.price_max} />




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






