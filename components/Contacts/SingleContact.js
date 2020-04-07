import React, {Component, useReducer} from 'react';
import {connect} from 'react-redux'
import {StyleSheet, Text, View, Switch, TouchableOpacity, ActivityIndicator, Image} from 'react-native';
import {Avatar} from 'react-native-elements'
import {Actions} from 'react-native-router-flux';
import {removeContact, changeConsent, addContact} from '../../store/user';

class SingleContact extends Component {
  constructor (props) {
    super(props)
    this.state={
      canTrack: this.props.route.params.solo.canTrack
    }
  }

  handleValueChange (value) {
    //figure out a way to change permissions based on state boolean of this.state.switch
    this.setState({canTrack: value})
    const myId = this.props.user.uid
    const theirId = this.props.route.params.solo.uid
    this.props.changeConsent(myId, theirId, value)
  }
  delete() {
    const myId = this.props.user.uid
    const theirId = this.props.route.params.solo.uid
    this.props.removeContact(myId, theirId)
    this.props.navigation.navigate("Current Contacts")
    //database update to remove solo from this user's array
  }
  sendInvite () {
    //notify other user that they have a friend request, pending acceptance, add solo and user BOTH to each other's contact lists
    const theirId = this.props.route.params.solo.uid
    const myId = this.props.user.uid
    const status = this.props.route.params.solo.status
    this.props.addContact(myId, theirId, status)
    this.props.navigation.navigate("Current Contacts")
  }

  render() {
    const solo = this.props.route.params.solo
    const user = this.props.user
    if (!this.props.route|| !this.props.addContact) return (<ActivityIndicator />)
    if (solo.status==='accepted') {return(
      <View style={styles.container}>
        <Text style={styles.title}>{solo.First} {solo.Last}</Text>
        <Avatar
                  size="xlarge"
                  rounded
                  borderColor="#4faadb"
                  borderWidth="5"
                  source={user.imgURL ? {uri: solo.imgURL} : { uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',}}
                />
        <View style={styles.buttonContainer}>
          <Text style={styles.textBoxTwo}>Allow {solo.First} to track you continuously?</Text>
          <Switch
          trackColor={{ false: "#767577", true: "#2f6380" }}
          thumbColor={solo.canTrack ? "#2f6380" : "#dcd8dc"}
          onValueChange={value => this.handleValueChange(value)}
          value={this.state.canTrack}
          />
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText} onPress={() => this.delete()}>Remove Contact</Text>
        </TouchableOpacity>
      </View>
    )}
    if (solo.status==='requested') {
      return (
        <View style={styles.container}>
        <Text style={styles.title}>{solo.First} {solo.Last}</Text>
          <Avatar
                  size="xlarge"
                  rounded
                  borderColor="#4faadb"
                  borderWidth="5"
                  source={user.imgURL ? {uri: user.imgURL} : { uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',}}
                />
        <Text style={styles.textBox}>{solo.email}</Text>
        <TouchableOpacity style={styles.button}>
        <Text  style={styles.buttonText} onPress={() => this.sendInvite()}>Confirm</Text>
      </TouchableOpacity>
      </View>
      )
    }
    if (solo.status==='pending') {
      return (
        <View style={styles.container}>
          <Text style={styles.title} >{solo.First} {solo.Last}</Text>
          <Avatar
                  size="xlarge"
                  rounded
                  borderColor="#4faadb"
                  borderWidth="5"
                  source={user.imgURL ? {uri: user.imgURL} : { uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',}}
                />
          <Text style={styles.textBox} >{solo.email}</Text>
          <TouchableOpacity>
          <Text style={styles.textBox}>Request pending...</Text>
        </TouchableOpacity>
        </View>
      )
    }
    if (solo.status==='wasDenied') {
      return(<View><Text style={styles.textBox}>Blocked</Text></View>)
    }
    else {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>{solo.First} {solo.Last}</Text>
          <Text style={styles.textBox}>{solo.email}</Text>
          <TouchableOpacity style={styles.button}>
          <Text  style={styles.buttonText} onPress={() => this.sendInvite()}>Send Invite</Text>
        </TouchableOpacity>
        </View>
      )
    }
  }
}
const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'flex-start'
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'space-between',
    margin: 1,
    fontSize: 18,
},
  textBox: {
      width: '90%',
      margin: 5,
      padding: 5,
      fontSize: 20,
      textAlign: 'center',
  },
  textBoxTwo: {
    width: '80%',
    margin: 5,
    padding: 5,
    fontSize: 17,
    textAlign: 'left',
},
title: {
  marginTop: 10,
  marginBottom: 10,
  paddingVertical: 5,
  alignItems: 'center',
  backgroundColor: '#4faadb',
  borderColor: '#4faadb',
  borderWidth: 1,
  borderRadius: 5,
  width: 300,
  fontSize: 25,
  fontWeight: 'bold',
  color: '#fff',
  textAlign: "center",
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
      width: 210,
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
    contacts: state.user.contacts
  }
  }
const mapDispatchToProps = dispatch => ({
      removeContact: (myId, theirId) => dispatch(removeContact(myId, theirId)),
      changeConsent: (myId, theirId, value) => dispatch(changeConsent(myId, theirId, value)),
      addContact: (myId, theirId, status) => dispatch(addContact(myId, theirId, status)),
  })

  export default connect(mapStateToProps, mapDispatchToProps)(SingleContact)
