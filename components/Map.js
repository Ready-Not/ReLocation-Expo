import React, {Component} from 'react';
import {View, StyleSheet, Text, SafeAreaView} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';


import Config from 'react-native-config';

Geocoder.init(Config.GOOGLE_MAPS_API_KEY);

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: null,
      longitude: null,
      error: null,
      error2: null,
      address: 'no address',
    };
  }
  async getAddress() {
    let lat = this.state.latitude;
    let long = this.state.longitude;
    Geocoder.from(lat, long)
      .then(json => {
        var addressComponent = json.results[0].address_components;
        let address = '';
        addressComponent.forEach(obj => {
          address += ' ' + obj.short_name;
        });
        this.setState({address});
        console.log(addressComponent);
      })
      .catch(error => this.setState({error2: error}));
  }
  componentDidMount() {
    Geolocation.getCurrentPosition(
      position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      error => this.setState({error: error.message}),
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
    );
  }
  componentDidUpdate() {
    this.getAddress();
  }
  render() {
    return (
      <SafeAreaView>
        <View style={styles.container}>
          <View style={styles.mapContainer}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              region={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}
            />
          </View>
          <View>
            <Text style={styles.textField}>My current location:</Text>
            <Text style={styles.textField}> {this.state.latitude} </Text>
            <Text style={styles.textField}> {this.state.longitude} </Text>
            <Text style={styles.textField}> {this.state.error} </Text>
            <Text style={styles.textField}> {this.state.address} </Text>
            <Text style={styles.textField}> {this.state.error2} </Text>
          </View>
        </View>
      </SafeAreaView>

        
    );
  }
}
const styles = StyleSheet.create({
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  textField: {
    backgroundColor: 'pink',
    alignItems: 'center',
    fontSize: 20,
  },
});
export default Map;
