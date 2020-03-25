import {firestore} from '../config';
import React, {Component} from 'react';
import {View, Text} from 'react-native';
import { useScreens } from 'react-native-screens';

export default class DataBaseTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    firestore
      .collection('users')
      .get()
      .then(snapshot => {
        let users = []
        snapshot.docs.forEach(doc => {
          let user = doc.data()
          users.push(user)
          this.setState({users: users});
        });
      });
  }

  render() {
    return (
      <View>
        {this.state.users.map(user => {
          return <Text>{user.First}</Text>
        })}
      </View>
    );
  }
}
