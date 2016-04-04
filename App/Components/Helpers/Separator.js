'use strict';
import React, {
  StyleSheet,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: '#bab2b2',
    flex: 1,
    marginLeft: 15,
  },
});

class Separator extends React.Component{
  render() {
    return (
      <View style={styles.separator} />
    )
  }
};

module.exports = Separator;