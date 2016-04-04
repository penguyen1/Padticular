var React = require('react-native');
var Signup = require('./Signup');
var Homepage = require('./Homepage');
var Separator = require('./Helpers/Separator');
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

class Login extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      username: '',
      password: '',
      isLoading: false,
      error: false
    }
  }

  handleSubmit() {
    this.setState({ isLoading: false })
    // authenticate user & get token
    // console.log('You entered: ', this.state)
    
    // redirect to homepage
    this.props.navigator.replace({
      title: 'Homepage',
      component: Homepage
    })
  }

  handleNextRoute() {
    this.props.navigator.pop()
  }

  render(){
    const showError = (
      this.state.error ? <Text>{this.state.error}</Text> : <View />
    );

    return (
      <View style={styles.mainContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}> Login </Text>
        {/*<Separator />*/}
          <TextInput
            style={styles.textInput}
            placeholder="Enter Username"
            onChangeText={(text)=>this.setState({ username: text})}
            value={this.state.username} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter Password"
            onChangeText={(text)=>this.setState({ password: text})}
            value={this.state.password} />

          <TouchableHighlight 
            style={styles.button}
            onPress={this.handleSubmit.bind(this)}
            underlayColor="white" >
              <Text style={styles.buttonText}>Login</Text>
          </TouchableHighlight>
          <ActivityIndicatorIOS
            animating={this.state.isLoading}
            color="#111"
            size="large"  />
          {showError}
          <View style={styles.footer}>
            <Text>Not a member?</Text>
            <TouchableHighlight 
              onPress={this.handleNextRoute.bind(this)}>
              <Text style={styles.link}>Sign up here</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    )
  }
}


module.exports = Login;









