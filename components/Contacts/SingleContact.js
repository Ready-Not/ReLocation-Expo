import React, {Component, useReducer} from 'react';
import {connect} from 'react-redux'
import {StyleSheet, Text, View, Switch} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {
  // removeContact, changeConsent,
  addContact} from '../../store/user';

class SingleContact extends Component {
  constructor (props) {
    super(props)
  }

  handleValueChange () {
    //figure out a way to change permissions based on state boolean of this.state.switch
    const uid = navigation.getParam('solo').uid
    this.props.changeConsent(uid, value)
  }
  delete() {
    const uid = navigation.getParam('solo').uid
    // this.props.removeContact(uid)
    this.props.navigation.goBack()
    //database update to remove solo from this user's array
  }
  sendInvite () {
    //notify other user that they have a friend request, pending acceptance, add solo and user BOTH to each other's contact lists
    const theirId = navigation.getParam('solo').uid
    const myId = this.props.user.uid
    const status = navigation.getParam('solo').status
    this.props.addContact(myId, theirId, status)
  }

  render() {
    const solo = navigation.getParam('solo')
    const user = this.props.user
    if (user.associatedUsers.includes(solo.uid) && solo.status==='accepted') {return(
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
          <Text onPress={this.delete}>X</Text>
        </TouchableOpacity>
      </View>
    )}
    if (user.associatedUsers.inclues(solo.uid) && solo.status==='requested') {
      return (
        <View>
        <Text>{solo.first} {solo.last}</Text>
        <Text>{solo.email}</Text>
        <TouchableOpacity>
        <Text onPress={this.sendInvite}>Confirm</Text>
      </TouchableOpacity>
      </View>
      )
    }
    if (user.associatedUsers.includes(solo.uid) && solo.status==='pending') {
      return (
        <View>
          <Text>{solo.first} {solo.last}</Text>
          <Text>{solo.email}</Text>
          <TouchableOpacity>
          <Text>Request pending...</Text>
        </TouchableOpacity>
        </View>
      )
    }
    if (user.associatedUsers.includes(solo.uid) && solo.status==='wasDenied') {
      return(<View><Text>Blocked</Text></View>)
    }
    else {
      return (
        <View>
          <Text>{solo.first} {solo.last}</Text>
          <Text>{solo.email}</Text>
          <TouchableOpacity>
          <Text onPress={this.sendInvite}>Send Invite</Text>
        </TouchableOpacity>
        </View>
      )
    }
  }
}
const mapStateToProps = () => {
  return {
    user: state.user,
    contacts: state.user.contacts
  }
  }
  const mapDispatchToProps = dispatch => {
    return {
      // removeContact: (uid) => dispatch(removeContact(uid)),
      // changeConsent: (uid, bool) => dispatch(changeConsent(uid, bool)),
      addContact: (myId, theirId, status) => dispatch(addContact(myId, theirId, status)),
    }
  }

  connect(mapStateToProps, mapDispatchToProps)(SingleContact)
  export default SingleContact
