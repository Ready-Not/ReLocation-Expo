import React, {Component} from 'react';
import {View, Text, Alert} from 'react-native';
// import firebase from 'react-native-firebase';
// import type {Notification} from 'react-native-firebase';

export default class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fcmToken: '***',
    };
  }

  componentDidMount() {
    this.getToken();
    //Sending notifications when application is open or in background
    //Will not send notifications if application is closed
    this.NotificationListener = firebase
      .notifications()
      .onNotification((notification: Notification) => {
        const {title, body} = notification;
        Alert.alert(`${title}, ${body}`);
      });
  }

  async getToken() {
    const fcmToken = await firebase.messaging().getToken();
    const fcmTokenShort = fcmToken.slice(0, 5);
    this.setState({fcmToken: `${fcmTokenShort}***`});
    console.log(fcmToken);
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Text>FCM Token: {this.state.fcmToken}</Text>
      </View>
    );
  }
}
