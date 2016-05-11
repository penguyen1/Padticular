'use strict'
const React = require('react-native');
const Button = require('react-native-button');
var {
  // Stylesheet,
  Text,
  View,
} = React;

// Error component - displays error message to user
class Error extends React.Component {
  render() {
    let Actions = this.props.routes;  // what info is inside this.props.routes??

    return (
      <View style={{ width:300, height:300, justifyContent:'center', alignItems:'center', backgroundColor:'white' }}>
        <Text>{this.props.data}</Text>
        <Button onPress={Actions.dismiss}>Ok, got it!</Button>
      </View>
    )
  }
}

// Styling for Error component
// var styles = Stylesheet.create({
//   container: {
//     width: 300,
//     height: 300,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'white',
//   },
// });

module.exports = Error;