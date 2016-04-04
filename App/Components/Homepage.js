var React = require('react-native');

var {
  Text,
  View,
  StyleSheet
} = React;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#48BBEC'
  },
  view: {
    flex: 1,
    backgroundColor: 'orange',
    paddingTop: 84
  }
});

class Homepage extends React.Component{
  render(){
    return(
      <View style={styles.wrapper}>
        <Text style={styles.view}>Homepage Component</Text>
      </View>
    )
  }
}


module.exports = Homepage;