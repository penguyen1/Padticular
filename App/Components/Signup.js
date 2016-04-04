'use strict'
var React = require('react-native');
var Login = require('./Login');

var {
  Text,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS,
  StyleSheet,
  View,
  Navigator
} = React;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 30,
    marginTop: 65,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#48BBEC'
  },
  formContainer: {
    flex: 1,
    padding: 20,
    marginTop: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#1da362'
  },
  title: {
    marginTop: -50,
    marginBottom: 20,
    fontSize: 45,
    textAlign: 'left',
    color: '#fff'
  },
  textInput: {
    height: 50,
    padding: 2,
    marginRight: 5,
    marginTop: 15,
    fontSize: 18,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 3,
    color: 'black',
    textAlign: 'center',
    backgroundColor: 'white',
    opacity: 0.8
  },
  buttonText: {
    fontSize: 18,
    color: '#111',
    alignSelf: 'center'
  },
  button: {
    height: 45,
    width: 120,
    flexDirection: 'row',
    backgroundColor: '#00b8ff',
    borderColor: '#233fc7',
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 30,
    marginLeft: 75,
    justifyContent: 'center'
  },
  footer: {
    marginTop: 30,
    marginBottom: -20,
    marginLeft: 65,
  },
  link: {
    color: 'blue',
    marginLeft: 25
  }
});

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
    this.props.navigator.replace({
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
