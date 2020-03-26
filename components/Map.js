import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

export default class MyMaps extends Component {

  state = {
    location: null,
    errorMessage: null,
    address: null,
  };

  constructor(props) {
    super(props);
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync().
      then (() => {
        this._getAddress();
      })
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location: {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    }
  });
  };

  _getAddress = async () => {
    let addressArr = await Location.reverseGeocodeAsync(this.state.location)
    let address = addressArr[0];
    this.setState({address: {
      streetAddress: address.name,
      city: address.city,
      state: address.region,
      country: address.isoCountryCode,
    }
  })
  }

  render() {
    let text = 'Waiting..';
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location && this.state.address) {
      text = `My location: ${JSON.stringify(this.state.location)}

      My address:
      ${JSON.stringify(this.state.address)}`
    } else {
      text = `My location: ${JSON.stringify(this.state.location)}

      My address: unknown`
    }

    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>{text}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
});

