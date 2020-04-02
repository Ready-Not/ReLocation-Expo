import React, {Component} from 'react';
import {connect} from 'react-redux'
import {StyleSheet, Text, View, TouchableOpacity, Button, ActivityIndicator} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {leaveGroup} from '../../store/user'
import {ListItem} from 'react-native-elements';

class SingleGroup extends Component {
  leave () {
    this.props.leaveGroup(this.props.route.params.group.id, this.props.user.uid)
    this.props.navigation.navigate("Current Groups")
  }

  render() {
    const group = this.props.route.params.group
    if (!this.props.user) return (<ActivityIndicator/>)
    return (
      <View>
        <Text>{group.name}</Text>
        <Text>Members:</Text>
        {group.usersInGroup.map(user => {
          return <ListItem key={user.uid}
          leftAvatar={{ source: { uri: user.imgURL} }}
          title={`${user.First} ${user.Last}`}
          subtitle={user.email}
          bottomDivider
          />
        })}
        <Text>Actively Tracking:</Text>
        {group.tracks ? group.tracks.map(track => {
          return <ListItem key={track.uid}
          title={`Tracking ${track.trackee}`}
          subtitle={`Tracking ends at ${track.time}`}/>
        }) : <Text>No Active Tracks</Text>}
        <TouchableOpacity>
          <Text onPress={() => this.leave()}>Leave Group</Text>
          </TouchableOpacity>
      </View>
    )
  }
}
const mapStateToProps = state => {
  return {
    user: state.user,
    contacts: state.user.contacts,
    groups: state.user.groups
  }
  }
  const mapDispatchToProps = dispatch => ({
      leaveGroup: (groupId, uid) => dispatch(leaveGroup(groupId, uid)),
  })

  export default connect(mapStateToProps, mapDispatchToProps)(SingleGroup)
