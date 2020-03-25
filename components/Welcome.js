import React, {Component} from 'react';
import {Router, Stack, Scene} from 'react-native-router-flux';
import Login from './Login';
import Signup from './Signup';

class Welcome extends Component {
  render() {
    return (
      <Router hideNavBar={false}>
        <Stack key="root">
          <Scene key="login" component={Login} title="Login" />
          <Scene key="signup" component={Signup} title="Sign up" />
        </Stack>
      </Router>
    );
  }
}

export default Welcome;
