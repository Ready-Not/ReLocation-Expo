import React, {Component} from 'react';
import { connect } from 'react-redux';
import {StyleSheet, Text, View, TouchableOpacity, Button} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {ListItem} from 'react-native-elements';

class CurrentGroups extends Component {
  render() {
    const groups = this.props.groups
    if (!groups) {
      return (
        <View>
          <Text>No current groups</Text>
          <Button title="Create a Group"
              onPress={() => this.props.navigation.navigate('Create Group')}
            />
        </View>)}
    else {return(
      <View>
        {groups.map(group => {
          return <ListItem key={group.id}
          leftAvatar={{ source: { uri: group.icon} }}
          rightElement={'>'}
          title={group.name}
          subtitle={`${group.usersInGroup.length} People`}
          bottomDivider
          onPress={() => this.props.navigation.navigate('Group', {group: group})}
          />
        })}
        <Button title="Create a Group"
            onPress={() => this.props.navigation.navigate('Create Group')}
          />
      </View>
    )}
  }
}
const mapStateToProps = state => {
  return {
    user: state.user,
    contacts: state.user.contacts,
    groups: state.user.groups
  }
}

  export default connect(mapStateToProps)(CurrentGroups)
