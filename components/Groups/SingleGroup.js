import React, {Component} from 'react';
import {connect} from 'react-redux'
import {StyleSheet, Text, View, TouchableOpacity, Button} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {leaveGroup} from '../../store/user'
import {ListItem} from 'react-native-elements';

class SingleGroup extends Component {
  constructor() {
    super()
  }

  leaveGroup () {
    this.props.leaveGroup(this.props.group.groupId, this.props.user.uid)
    this.props.navigation.goBack()
  }

  render() {
    const group = this.props.route.params.group
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
  const mapDispatchToProps = dispatch => ({
      leaveGroup: (groupId, uid) => dispatch(leaveGroup(groupId, uid)),
  })

  export default connect(mapStateToProps, mapDispatchToProps)(SingleGroup)
