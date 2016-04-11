var React = require('react-native');

var {
  View,
  WebView,
  StyleSheet
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6EF',
    flexDirection: 'column',
  },
});

class Web extends React.Component{
  render() {
  console.log('WEB URL: ', this.props.url)
  console.log('WEB key: ', this.props.id)
    return (
      <View style={styles.container}>
        <WebView key={this.props.id} source={{ uri: this.props.url }} />
      </View>
    );
  }
};

Web.propTypes = {
 url: React.PropTypes.string.isRequired
};

module.exports = Web;