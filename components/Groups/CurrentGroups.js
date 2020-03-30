import React, {Component} from 'react';
import { connect } from 'react-redux';
import {StyleSheet, Text, View, TouchableOpacity, Button} from 'react-native';
import {Actions} from 'react-native-router-flux';

class CurrentGroups extends Component {
  render() {
    const groups = this.props.groups
    if (groups) {return(
      <View>
        {groups.map(group => {
          return <ListItem key={group.uid}
          leftAvatar={{ source: { uri: group.icon} }}
          title={group.name}
          subtitle={`${group.usersInGroup.length} People`}
          bottomDivider
          onPress={this.props.navigation.navigate('SingleGroup'), {group: group}}
          />
        })}
        <Button title="Create a Group"
            onPress={() => this.props.navigation.navigate('CreateGroup')}
          />
      </View>
    )} else {return (
      <View>
        <Text>No current groups</Text>
        <Button title="Create a Group"
            onPress={() => this.props.navigation.navigate('CreateGroup')}
          />
      </View>)}
  }
}
const mapStateToProps = () => {
  return {
    user: state.user,
    contacts: state.user.contacts,
    groups: state.user.groups
  }
}

  connect(mapStateToProps)(CurrentGroups)
  export default CurrentGroups
