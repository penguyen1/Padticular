'use strict'
var React = require('react-native');

var {
  Text,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS,
  StyleSheet,
  View
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
    marginTop: 40,
    fontSize: 25,
    textAlign: 'left',
    color: '#fff'
  },
  textInput: {
    height: 50,
    padding: 4,
    marginRight: 5,
    marginTop: 40,
    fontSize: 18,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    color: 'white',
    justifyContent: 'center',
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
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 40,
    marginLeft: 75,
    justifyContent: 'center'
  },
});

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

  handleChange(event) {
    this.setState({ username: event.nativeEvent.text })
  }

  handleSubmit() {
    this.setState({ isLoading: true })
    console.log('username: ', this.state.username)
  }

  render(){
    const showError = (
      this.state.error ? <Text>{this.state.error}</Text> : <View />
    );

    return (
      <View style={styles.mainContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}> Login </Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter Username"
            value={this.state.username}
            onChange={this.handleChange.bind(this)} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter Password"
            value={this.state.password}
            onChange={this.handleChange.bind(this)} />

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
        </View>
      </View>
    )
  }
}


module.exports = Login;









