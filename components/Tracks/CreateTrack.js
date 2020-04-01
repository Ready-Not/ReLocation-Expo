import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, Alert, Dimensions, ActivityIndicator } from 'react-native'
import { Dropdown } from 'react-native-material-dropdown';
import  MapView  from 'react-native-maps'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import firebase from '../../config';
import Map from '../Map'
import { setTrackThunk } from '../../store/tracks'
import DateTimePicker from '@react-native-community/datetimepicker';
import Touchable from 'react-native-platform-touchable';

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';



class TrackForm extends React.Component {

  // state to locally store track info . . . not sure if this is necessary
  constructor (props) {
    super (props);
    this.state = {
      targetAddress: '',
      currentLocation: null,
      ETA: new Date (),
      inProgress: false,
      finalLocation: null,
      error: null
    }
    this.handleAddress = this.handleAddress.bind(this)
  }

  //get list off users' associated users from store to create data array for dropdown list. Include user so they can select themself
  //get list of users' associated locations from store to create data array for dropdown list. Include option to search for location on map

  //create trackers array based on form input

  //function to verify if trackers have consent

  //function to submit track instance

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      console.log('no permissions were granted')
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ currentLocation: {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    }
  });
  };

  _attemptGeocodeAsync = async () => {

    this.setState({ inProgress: true, error: null });
    try {
    let location = await Location.geocodeAsync(this.state.targetAddress);
    this.setState({ finalLocation: {
      latitude: location[0].latitude,
      longitude: location[0].longitude
    } });
    } catch (e) {
    this.setState({ error: e.message });
    } finally {
    this.setState({ inProgress: false });
    }
    };


  _maybeRenderResult = () => {
    let { targetAddress, finalLocation } = this.state;
    let text = typeof targetAddress === 'string'
      ? targetAddress
      : JSON.stringify(targetAddress);

    if (this.state.inProgress) {
      return <ActivityIndicator style={{ marginTop: 10 }} />;
    } else if (finalLocation) {
      return (
        <Text style={styles.resultText}>
          {text} resolves to {JSON.stringify(finalLocation)}
        </Text>
      );
    } else if (this.state.error) {
      return (
        <Text style={styles.errorResultText}>
          {text} cannot resolve: {JSON.stringify(this.state.error)}
        </Text>
      );
    }
  };


  handleAddress = event => {
    console.log(event.nativeEvent.text)
    this.setState({
      targetAddress: event.nativeEvent.text
    })
  }

  componentDidMount () {
    this._getLocationAsync()
  }

  render() {

    let data = [{value: 'Martha'}, {value: 'Jen'}, {value: 'Julia'}, {value: 'Luis'}, {value: 'James'}, {value: 'Cyndi'}]

    return (
       <View style={styles.container}>
         <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Select a location</Text>
        </View>


        <TextInput
        value={this.state.targetAddress}
        onChange={this.handleAddress}
        placeholder='Journey Destination'
        style={styles.inputBox}
        ></TextInput>

        <View style={styles.separator} />

        <View style={styles.actionContainer}>
          <Button
              onPress={this._attemptGeocodeAsync}
              title="Set Destination"
              disabled={typeof this.state.targetAddress !== 'string'}
              style={styles.button}
            />
        </View>

        <View style={styles.separator} />

       {/* <Dropdown
        label="trackee"
        style={styles.inputBox}
        data={data}
        itemCount={3}
        //value={this.state.trackee}
        >
        </Dropdown> */}

        {/* <TextInput
       // value={this.state.location}
        placeholder='location'
        style={styles.inputBox}
        ></TextInput> */}

        {/* <TextInput
        //value={this.state.eta}
        placeholder='eta'
        style={styles.inputBox}
        ></TextInput> */}

        {/* <DateTimePicker
          value={this.state.ETA}
          style={{ width: 200 }}
          mode={'time'}
          is24Hour={true}
          display="default"
          onChange={(event, selectedTime) => this.setState({ETA: selectedTime})}
        />

        <View style={styles.separator} />

        <DateTimePicker
          value={this.state.ETA}
          style={{ width: 200 }}
          display="default"
          onChange={(event, selectedDate) => this.setState({ETA: selectedDate})}
        /> */}

        {/* <MapView style={styles.mapStyle} /> */}



        {/* <TextInput
       // value={this.state.tracker}
        placeholder='trackers'
        style={styles.inputBox}
        ></TextInput> */}

        <Button title="Submit Your Tracking Request" onPress={() => {
          this.props.setTrackThunk(this.state)
          this.props.navigation.navigate('AllTracks')}
        }
        />
      <Button title="See all my tracks" onPress={() => {
          this.props.navigation.navigate('AllTracks')}
        }
        />

        {this._maybeRenderResult()}
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'flex-start'
  },
  inputBox: {
      width: '85%',
      margin: 10,
      padding: 15,
      fontSize: 16,
      borderColor: '#d3d3d3',
      borderBottomWidth: 1,
      textAlign: 'center'
  },
  button: {
      marginTop: 30,
      marginBottom: 20,
      paddingVertical: 5,
      alignItems: 'center',
      backgroundColor: '#FFA611',
      borderColor: '#FFA611',
      borderWidth: 1,
      borderRadius: 5,
      width: 200
  },
  buttonText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff'
  },
  buttonSignup: {
      fontSize: 12
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  headerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginHorizontal: 20,
    marginBottom: 0,
    marginTop: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  examplesContainer: {
    paddingTop: 15,
    paddingBottom: 5,
    paddingHorizontal: 20,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginTop: 10,
    marginBottom: 5,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  resultText: {
    padding: 20,
  },
  errorResultText: {
    padding: 20,
    color: 'red',
  },
})

// functions in the store to make calls to the firestore.

const mapDispatchToProps = dispatch => {

  //getFriends Thunk
  // createTrack Thunk
  //createLocation Thunk
  return bindActionCreators({ setTrackThunk }, dispatch)

}

const mapStateToProps = state => {
//  user
//  user's associated users
}


export default connect(
  // mapStateToProps,
  null,
  mapDispatchToProps
)(TrackForm)


