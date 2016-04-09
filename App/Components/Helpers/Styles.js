var React = require('react-native');

var {
  StyleSheet
} = React;

module.exports = StyleSheet.create({
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
    marginBottom: 50,
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
    marginTop: -10,
    marginBottom: 20,
    marginLeft: 85,
  },
  link: {
    color: 'blue',
    marginLeft: 7
  },
  header: {
    marginTop: -50,
    fontSize: 27,
    textAlign: 'center',
    backgroundColor: 'white'
  },
  favorites: {
    padding: 20,
    marginTop: 40,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#1da362',
    borderWidth: 2,
    borderColor: 'black',
    height: 330,
    position: 'relative'
  },
  listTitle: {
    backgroundColor: 'yellow',
    fontSize: 15,
    textAlign: 'center',
    position: 'absolute',
    top: 15,
  },
  listFavs: {
    color: 'white',
    fontSize: 20,
  }
});




