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

class Test extends React.Component{
  render(){
    return(
      <View style={styles.wrapper}>
        <Text style={styles.view}>Testing Component</Text>
      </View>
    )
  }
}


module.exports = Test;