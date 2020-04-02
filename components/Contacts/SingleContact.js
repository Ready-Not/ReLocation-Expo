import React, {Component, useReducer} from 'react';
import {connect} from 'react-redux'
import {StyleSheet, Text, View, Switch, TouchableOpacity, ActivityIndicator, Image} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {removeContact, changeConsent, addContact} from '../../store/user';

class SingleContact extends Component {
  constructor (props) {
    super(props)
    this.state={
      canTrack: this.props.route.params.solo.canTrack
    }
  }

  handleValueChange (value) {
    //figure out a way to change permissions based on state boolean of this.state.switch
    this.setState({canTrack: value})
    const myId = this.props.user.uid
    const theirId = this.props.route.params.solo.uid
    this.props.changeConsent(myId, theirId, value)
  }
  delete() {
    const myId = this.props.user.uid
    const theirId = this.props.route.params.solo.uid
    this.props.removeContact(myId, theirId)
    this.props.navigation.navigate("Current Contacts")
    //database update to remove solo from this user's array
  }
  sendInvite () {
    //notify other user that they have a friend request, pending acceptance, add solo and user BOTH to each other's contact lists
    const theirId = this.props.route.params.solo.uid
    const myId = this.props.user.uid
    const status = this.props.route.params.solo.status
    this.props.addContact(myId, theirId, status)
  }

  render() {
    const solo = this.props.route.params.solo
    const user = this.props.user
    if (!this.props.route|| !this.props.addContact) return (<ActivityIndicator />)
    if (solo.status==='accepted') {return(
      <View>
        <Image source={solo.imgURL} />
        <Text>{solo.First} {solo.Last}</Text>
        <Switch
        trackColor={{ false: "#767577", true: "#a79bff" }}
        thumbColor={solo.canTrack ? "#7a68ff" : "#dcd8dc"}
        onValueChange={value => this.handleValueChange(value)}
        value={this.state.canTrack}
        />
        <TouchableOpacity>
          <Text onPress={() => this.delete()}>Remove Contact</Text>
        </TouchableOpacity>
      </View>
    )}
    if (solo.status==='requested') {
      return (
        <View>
        <Text>{solo.First} {solo.Last}</Text>
        <Text>{solo.email}</Text>
        <TouchableOpacity>
        <Text onPress={() => this.sendInvite()}>Confirm</Text>
      </TouchableOpacity>
      </View>
      )
    }
    if (solo.status==='pending') {
      return (
        <View>
          <Text>{solo.First} {solo.Last}</Text>
          <Text>{solo.email}</Text>
          <TouchableOpacity>
          <Text>Request pending...</Text>
        </TouchableOpacity>
        </View>
      )
    }
    if (solo.status==='wasDenied') {
      return(<View><Text>Blocked</Text></View>)
    }
    else {
      return (
        <View>
          <Text>{solo.First} {solo.Last}</Text>
          <Text>{solo.email}</Text>
          <TouchableOpacity>
          <Text onPress={() => this.sendInvite()}>Send Invite</Text>
        </TouchableOpacity>
        </View>
      )
    }
  }
}
const mapStateToProps = state => {
  return {
    user: state.user,
    contacts: state.user.contacts
  }
  }
const mapDispatchToProps = dispatch => ({
      removeContact: (myId, theirId) => dispatch(removeContact(myId, theirId)),
      changeConsent: (myId, theirId, value) => dispatch(changeConsent(myId, theirId, value)),
      addContact: (myId, theirId, status) => dispatch(addContact(myId, theirId, status)),
  })

  export default connect(mapStateToProps, mapDispatchToProps)(SingleContact)
