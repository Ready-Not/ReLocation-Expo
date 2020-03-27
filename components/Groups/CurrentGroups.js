import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Actions} from 'react-native-router-flux';

const CurrentGroups = () => {
    //let groups = user groups from state/async storage
    return(
      <View>
        {groups.map(group => {
          return <ListItem key={group.uid}
          leftAvatar={{ source: { uri: group.icon} }}
          title={group.name}
          subtitle={`${group.usersInGroup.length} People`}
          bottomDivider
          // onPress={NAV_TO_SOLO_Group with props solo=groupInfo}
          />
        })}
      </View>
    )
}
const mapStateToProps = () => {
  return {
    user: state.user,
    contacts: state.user.contacts,
    groups: state.user.groups
  }
  }
  const mapDispatchToProps = dispatch => {

  }

  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(CurrentGroups)
