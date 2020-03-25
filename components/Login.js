import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Form from './Form';

class Login extends Component {
  signup() {
    Actions.signup();
  }
  render() {
    return (
      <View>
        <Text>{'\n'}</Text>
        <Text>{'\n'}</Text>
        <Form type="Login" />
        <View>
          <Text>No account yet? </Text>
          <TouchableOpacity onPress={this.signup}>
            <Text>Signup</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default Login;
