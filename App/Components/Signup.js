'use strict'
var React = require('react-native');
var Login = require('./Login');
var styles = require('./Helpers/Styles')

var {
  Text,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS,
  StyleSheet,
  View,
  Navigator
} = React;


class Signup extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      username: '',
      fullname: '',
      password: '',
      isLoading: false,
      error: false
    }
  }

  handleSubmit() {
    this.setState({ isLoading: false })
    // authenticate user & get token
    // redirect to homepage
    console.log('You entered: ', this.state)
  }

  handleNextRoute() {
    this.props.navigator.push({
      title: 'Login',
      component: Login
    });
  }

  render(){
    const showError = (
      this.state.error ? <Text>{this.state.error}</Text> : <View />
    );

    return (
      <View style={styles.mainContainer}>
        {/*<View style={styles.nav} />*/}
        <View style={styles.formContainer}>
          <Text style={styles.title}> Signup </Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your full Name"
            onChangeText={(text)=>this.setState({ fullname: text})}
            value={this.state.fullname} />
          <TextInput
            style={styles.textInput}
            placeholder="Create a Username"
            onChangeText={(text)=>this.setState({ username: text})}
            value={this.state.username} />
          <TextInput
            style={styles.textInput}
            placeholder="Create a Password"
            onChangeText={(text)=>this.setState({ password: text})}
            value={this.state.password} />

          <TouchableHighlight 
            style={styles.button}
            onPress={this.handleSubmit.bind(this)}
            underlayColor="white" >
              <Text style={styles.buttonText}>Sign Me Up!</Text>
          </TouchableHighlight>
          <ActivityIndicatorIOS
            animating={this.state.isLoading}
            color="#111"
            size="large"  />
          {showError}
          <View style={styles.footer}>
            <Text>Already a member?</Text>
            <TouchableHighlight 
              onPress={this.handleNextRoute.bind(this)}>
              <Text style={styles.link}>Log In here</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    )
  }
}


module.exports = Signup;
