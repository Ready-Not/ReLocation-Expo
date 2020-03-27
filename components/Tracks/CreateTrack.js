import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button } from 'react-native'
import { Dropdown } from 'react-native-material-dropdown';
import { MapView } from 'expo'
import { connect } from 'react-redux'
import firebase from '../../config';
import Map from '../Map'
//component shows form for creating a track instance

class TrackForm extends React.Component {

  // state to locally store track info . . . not sure if this is necessary
  constructor (props) {
    super (props);

  }

  //get list off users' associated users from store to create data array for dropdown list. Include user so they can select themself
  //get list of users' associated locations from store to create data array for dropdown list. Include option to search for location on map

  //create trackers array based on form input

  //function to verify if trackers have consent

  //function to submit track instance

  render() {
    let data = [{value: 'Martha'}, {value: 'Jen'}, {value: 'Julia'}, {value: 'Luis'}, {value: 'James'}, {value: 'Cyndi'}]
    return (
       <View style={styles.container}>
       <Dropdown
        label="trackee"
        style={styles.inputBox}
        data={data}
        itemCount={3}
        //value={this.state.trackee}
        >
        </Dropdown>
        <Map />
        <TextInput
       // value={this.state.location}
        placeholder='location'
        style={styles.inputBox}
        ></TextInput>

        <TextInput
        //value={this.state.eta}
        placeholder='eta'
        style={styles.inputBox}
        ></TextInput>

        <TextInput
       // value={this.state.tracker}
        placeholder='trackers'
        style={styles.inputBox}
        ></TextInput>

        <Button title="Submit Your Tracking Request" style={styles.button}
         onPress={() => this.props.navigation.navigate('SingleTrack')}
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

}

const mapStateToProps = state => {
//  user
//  user's associated users
}


export default TrackForm


