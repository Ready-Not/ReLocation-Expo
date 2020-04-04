import React, {Component} from 'react';
import { connect } from 'react-redux';
import {StyleSheet, Text, View, TouchableOpacity, Button} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {ListItem, rightElement} from 'react-native-elements';

class CurrentGroups extends Component {
  render() {
    const groups = this.props.groups
    if (!groups) {
      return (
        <View style={styles.container}>
          <Text style={styles.textBox}>No current groups</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText} onPress={() => this.props.navigation.navigate('Create Group')}>Create a Group</Text>
          </TouchableOpacity>
        </View>)}
    else {return(
      <View>
        {groups.map((group, i) => {
          return <ListItem key={group.id}
          leftElement={<Text style={ {fontSize: 20,
            fontWeight: 'bold',
            color: '#4faadb'}}>{i+1}</Text>}
          rightElement={'>'}
          title={group.name}
          subtitle={`${group.usersInGroup.length} Members`}
          bottomDivider
          onPress={() => this.props.navigation.navigate('Group', {group: group})}
          />
        })}
        <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText} onPress={() => this.props.navigation.navigate('Create Group')}>Create a Group</Text>
          </TouchableOpacity>
      </View>
    )}
  }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'flex-start'
  },
  textBox: {
      width: '90%',
      margin: 5,
      padding: 5,
      fontSize: 20,
      textAlign: 'center',
  },
  button: {
      marginTop: 10,
      marginBottom: 10,
      paddingVertical: 5,
      alignItems: 'center',
      backgroundColor: '#4faadb',
      borderColor: '#4faadb',
      borderWidth: 1,
      borderRadius: 5,
      width: 250,
      alignSelf: 'center'
  },
  buttonText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff'
  },
})
const mapStateToProps = state => {
  return {
    user: state.user,
    contacts: state.user.contacts,
    groups: state.user.groups
  }
}

  export default connect(mapStateToProps)(CurrentGroups)
