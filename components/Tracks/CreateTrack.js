import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import { connect } from 'react-redux'
import firebase from '../config';

class TrackForm extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      trackee: '',
      location: '',
      eta: '',
      tracker: []
    }
  }

  //create trackers array

  //function to verify if trackers have consent

  //function to submit track instance

  render() {
    return (
      <View>
        <Text>Hello, you are in the CreateTrack Form component</Text>
        <TextInput
        value={this.state.trackee}
        placeholder='trackee'
        ></TextInput>

        <TextInput
        value={this.state.location}
        placeholder='location'
        ></TextInput>

        <TextInput
        value={this.state.eta}
        placeholder='eta'
        ></TextInput>

        <TextInput
        value={this.state.trackee}
        placeholder='trackers'
        ></TextInput>
      </View>
    )
  }

}

export default TrackForm
