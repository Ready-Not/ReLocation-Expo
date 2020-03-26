import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ListItem} from 'react-native';
import {Actions} from 'react-native-router-flux';

class SingleGroup extends Component {
  constructor() {
    super()
    this.state={}
    this.leaveGroup=this.leaveGroup.bind(this)
  }

  leaveGroup () {
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
