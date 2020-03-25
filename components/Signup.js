import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Form from './Form';

class Signup extends Component {
  goBack() {
    Actions.pop();
  }
  render() {
    return (
      <View>
        <Text>{'\n'}</Text>
        <Text>{'\n'}</Text>
        <Form type="Signup" />
        <View>
          <Text>Already have an account? </Text>
          <TouchableOpacity onPress={this.goBack}>
            <Text>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default Signup;
