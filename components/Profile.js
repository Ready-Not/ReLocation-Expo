import React, {Component} from 'react';
import {View, Text} from 'react-native';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: [],
    };
  }

  render() {
    return (
      <View>
        <Text>Welcome!</Text>
        <Text>This is a profile page</Text>
    <Text>{this.props.route.params.email}</Text>
      </View>
    );
  }
}
