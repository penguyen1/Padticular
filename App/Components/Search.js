'use strict'
const React = require('react-native');
const Firebase = require('firebase');
var api = require('../Utils/api');
var styles = require('./Helpers/Styles');
var Homepage = require('./Homepage');
var YesOrNo = require('./YesOrNo');
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
      min_bedrooms: '',    
      min_bathrooms: '',    
      price_max: '',      
      price_min: '', 
    };
  }

  componentWillMount(){
    console.log('checking user auth @Search: ', ref.getAuth());
    // ref.getAuth();   // checks user auth state
  }

  // gets list of AirBnB ids -> getApartmentInfo for each id
  hitAPIagain(ids){
    console.log('gotttem! ', ids)
    // var apts = ids.map((el)=>console.log(el))
    // if it works, send to API and get back the CORRECT format for each apt
  }


  // store this in hitAPIagain??
  handleYesOrNo(){
  // // pass info to YesOrNo Component
  // this.props.navigator.push({
  //   title: 'Swipe: Right to save, Left to skip!',
  //   component: YesOrNo,
  //   passProps: {
  //     user: this.props.user,
  //     apts: res.search_results
  //   }
  // })
  }


  // call AirBnB API, get response, redirect & pass info to YesOrNo Component
  // **** how do we reset the Search Form fields?? ****
  handleSubmit(){
    this.setState({ location: this.state.location+",US" })    // search specification to US only

    // convert this.state values into a valid AirBnB URL parameter string
    var params = Object.keys(this.state).map((el)=>{
      return( this.state[el].length ? `&${el}=${this.state[el]}` : '' )
    }).join('')

    // call getApartments in api.js & get back a response
    api.getApartments(params)
      .then((res) =>{
        // checks if results were returned
        if(res.search_results.length){
          // console.log('BOOOOYYAAA: ', res.search_results)
          var x = Object.keys(res.search_results).map((el)=>res.search_results[el].listing.id)
        } else {
          console.log('No Results Found!')
        }
        // this.hitAPIagain(x)

        // pass info to YesOrNo Component
        this.props.navigator.push({
          title: 'Swipe: Right to save, Left to skip!',
          component: YesOrNo,
          passProps: {
            user: this.props.user,
            apts: x
          }
        })
      }).catch((err)=>console.log('ERROR getting listings from Search: ',err))
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


          {/* need to move setState in handleSubmit to refresh text fields?? */}
          {/* validate text inputs?? */}


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






