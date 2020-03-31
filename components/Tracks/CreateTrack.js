import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, Alert } from 'react-native'
import { Dropdown } from 'react-native-material-dropdown';
import  MapView  from 'react-native-maps'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import firebase from '../../config';
import Map from '../Map'
import { setTrackThunk } from '../../store/tracks'
import DateTimePicker from '@react-native-community/datetimepicker';

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';


class TrackForm extends React.Component {

  // state to locally store track info . . . not sure if this is necessary
  constructor (props) {
    super (props);
    this.state = {
      currentLocation: null,
      ETA: new Date (),
    }

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

  componentDidMount () {
    this._getLocationAsync()
  }

  render() {
    let data = [{value: 'Martha'}, {value: 'Jen'}, {value: 'Julia'}, {value: 'Luis'}, {value: 'James'}, {value: 'Cyndi'}]
    return (
       <View style={styles.container}>
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

        <DateTimePicker
          style={{ width: 200 }}
          value={this.state.ETA}
          display="default"
          onChange={(event, selectedDate) => {this.setState({ETA: selectedDate})}}
        />

        <DateTimePicker
          style={{ width: 200 }}
          value={this.state.ETA}
          mode={'time'}
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) => this.setState({ETA: selectedDate})}
        />


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
  }
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


