import React, {Component, useReducer} from 'react';
import {StyleSheet, Text, View, Switch} from 'react-native';
import {Actions} from 'react-native-router-flux';

class SingleContact extends Component {
  constructor (props) {
    super(props)
    // this.handleValueChange=this.handleValueChange.bind(this)
  }

  handleValueChange () {
    //figure out a way to change permissions based on state boolean of this.state.switch
  }
  removeContact() {
    //database update to remove solo from this user's array
  }
  addContact () {
    //notify other user that they have a friend request, pending acceptance, add solo and user BOTH to each other's contact lists
  }

  render() {
    const {solo} = this.props
    if (user.associatedUsers.includes(solo)) {return(
      <View>
        <Text>{solo.first} {solo.last}</Text>
        <Switch
        trackColor={{ false: "#767577", true: "#a79bff" }}
        thumbColor={solo.canTrack ? "#7a68ff" : "#dcd8dc"}
        // ios_backgroundColor="#3e3e3e"
        onValueChange={this.handleValueChange}
        value={solo.canTrack}
        />
        <TouchableOpacity>
          <Text onPress={this.removeContact}>X</Text>
        </TouchableOpacity>
      </View>
    )}
    else {
      return (
        <View>
          <Text>{solo.first} {solo.last}</Text>
          <Text>{solo.email}</Text>
          <TouchableOpacity>
          <Text onPress={this.addContact}>Send Invite</Text>
        </TouchableOpacity>
        </View>
      )
    }
  }
}

export default SingleContact
