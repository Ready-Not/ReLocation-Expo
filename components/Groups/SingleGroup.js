import React, {Component} from 'react';
import {connect} from 'react-redux'
import {StyleSheet, Text, View, TouchableOpacity, Button, ActivityIndicator} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {leaveGroup} from '../../store/user'
import {ListItem, Divider} from 'react-native-elements';

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
        <Text style={styles.title}>{group.name}</Text>
        <Divider backgroundColor='#4faadb' width='75%' alignSelf='center'/>
        <Text style={styles.textBox}>Members:</Text>
        {group.usersInGroup.map(user => {
          return <ListItem key={user.uid}
          leftAvatar={{ source: user.imgURL ? {uri: user.imgURL} : { uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',}} }
          title={`${user.First} ${user.Last}`}
          subtitle={user.email}
          bottomDivider
          />
        })}
        <Text style={styles.textBox}>Actively Tracking:</Text>
        {group.tracks ? group.tracks.map(track => {
          return <ListItem key={track.uid}
          title={`Tracking ${track.trackee}`}
          subtitle={`Tracking ends at ${track.time}`}/>
        }) : <Text style={styles.textBox}>No Active Tracks</Text>}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText} onPress={() => this.leave()}>Leave Group</Text>
          </TouchableOpacity>
      </View>
    )
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
  title: {
    width: '90%',
    margin: 3,
    padding: 3,
    fontSize: 24,
    textAlign: 'center',
    color: '#4faadb',
    fontWeight: 'bold',
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
      width: 300,
      alignSelf: 'center',
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
  const mapDispatchToProps = dispatch => ({
      leaveGroup: (groupId, uid) => dispatch(leaveGroup(groupId, uid)),
  })

  export default connect(mapStateToProps, mapDispatchToProps)(SingleGroup)
