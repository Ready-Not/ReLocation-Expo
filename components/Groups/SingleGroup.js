import React, {Component} from 'react';
import {connect} from 'react-redux'
import {StyleSheet, Text, View, TouchableOpacity, ListItem, Button} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {leaveGroup} from '../../store/user'

class SingleGroup extends Component {
  constructor() {
    super()
  }

  leaveGroup () {
    this.props.leaveGroup(this.props.group.groupId, this.props.user.uid)
    this.props.navigation.goBack()
  }

  render() {
    const group = navigation.getParam('group')
    return (
      <View>
        <Text>{group.name}</Text>
        <Text>Members:</Text>
        {group.usersInGroup.map(user => {
          return <ListItem key={user.uid}
          leftAvatar={{ source: { uri: user.imgURL} }}
          title={`${user.first} ${user.last}`}
          subtitle={user.email}
          bottomDivider
          onPress={() => this.props.navigation.navigate('SingleContact', {solo: user})}
          />
        })}
        <Text>Actively Tracking:</Text>
        {group.tracks.map(track => {
          return <ListItem key={track.uid}
          title={`Tracking ${track.trackee}`}
          subtitle={`Tracking ends at ${track.time}`}/>
        })}
        <TouchableOpacity>
          <Text onPress={this.leaveGroup}>Leave Group</Text>
          </TouchableOpacity>
      </View>
    )
  }
}
const mapStateToProps = () => {
  return {
    user: state.user,
    contacts: state.user.contacts,
    groups: state.user.groups
  }
  }
  const mapDispatchToProps = dispatch => {
    return {
      leaveGroup: (groupId, uid) => dispatch(leaveGroup(groupId, uid)),
    }
  }

  connect(mapStateToProps, mapDispatchToProps)(SingleGroup)
  export default SingleGroup
