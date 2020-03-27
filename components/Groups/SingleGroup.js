import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ListItem} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {leaveGroup} from '.../store/user'

class SingleGroup extends Component {
  constructor() {
    super()
    this.state={}
    this.leaveGroup=this.leaveGroup.bind(this)
  }

  leaveGroup () {
    this.props.leaveGroup(this.props.group.groupId, this.props.user.uid)
    //figure out a way to remove this user from group and send them back to an updated Current Groups screen
  }

  render() {
    const {group} = this.props
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
          // onPress={NAV_TO_SOLO_CONTACT with props solo=user}
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
      leaveGroup: (groupId, uid) => dispatch(leaveGroup(groupI, uid)),
    }
  }

  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(SingleGroup)
