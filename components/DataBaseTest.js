import {firestore} from '../config';
import React, {Component} from 'react';
import {View, Text} from 'react-native';

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
        snapshot.docs.forEach(doc => {
          // let userFirst = doc.dm.proto.fields.First.stringValue;
          // console.log(userFirst, typeof userFirst);
          let user = doc.data()
          this.setState({users: user});
          console.log(this.state.users);
        });
      });
  }

  render() {
    return (
      <View>
        {this.state.users.map(user => {
          return <Text>{user}</Text>
        })}
      </View>
    );
  }
}
