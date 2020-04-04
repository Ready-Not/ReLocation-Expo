import React, {Component} from 'react';
import { connect } from 'react-redux'
import {StyleSheet, Text, View, TouchableOpacity, TextInput, Button} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {search, addContact, removeFound} from '../../store/user';
import {Avatar} from 'react-native-elements';

class FindContact extends Component {
  constructor () {
    super()
    this.state={}
  }

  sendInvite () {
    let status
    if (!this.props.found.status) status=''
    if (this.props.found.status==='requested') status='pending'
    if (this.props.found.status==='pending') status='requested'
    if (this.props.found.status==='denied') status='wasDenied'
    if (this.props.found.status==='wasDenied') status='denied'
    console.log('sendInvite', status)
    if (status!=='wasDenied') {
      this.props.addContact(this.props.user.uid, this.props.found.uid, status)
    }
    //figure out a way to send that user an invite to connect, if accepted, put in database using found
  }

  render() {
    // let currentContacts = this.state.user.associatedUsers
    if (!this.props.found) {return(
      <View style={styles.container}>
      <Text style={styles.title}>Enter email to find contact:</Text>
      <View style={styles.rowContainer}>
        <TextInput
            fontSize='20'
            onChangeText={email => this.setState({email})}
            placeholder="user@gmail.com"
            placeholderTextColor="#ddd"
            width='75%'
          />

          <TouchableOpacity>
            <Text
            style={{padding: 5}}
            onPress={() => this.props.search(this.state.email.toLowerCase(), this.props.user.uid)}> 🔍 </Text>
          </TouchableOpacity>
      </View>
      </View>
    )} else if (this.props.found.error) {return(
      <View style={styles.container}>
      <Text style={styles.textBox}>{this.props.found.error}</Text>
      <TouchableOpacity style={styles.button}>
        <Text
          style={styles.buttonText}
          onPress={ () => {
          this.props.removeFound()
          this.props.navigation.navigate('Current Contacts')}}>Go back to AllContacts</Text>
      </TouchableOpacity>
    </View>
    )} else {return(
      <View style={styles.container}>
        <Text style={styles.title}>User associated with email:</Text>
        <Avatar
          size="xlarge"
          rounded
          borderColor="#4faadb"
          borderWidth="5"
          source={this.props.found.imgURL ? this.props.found.imgURL : { uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',}}
        />
        <Text style={styles.textBox}>{this.props.found.First} {this.props.found.Last}</Text>
        <Text style={styles.textBox}>{this.props.found.email}</Text>
        <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText} onPress={() => this.sendInvite()}>{(this.props.found.status==='requested') ? 'Invite Sent' : 'Send Invite'}</Text>
        </TouchableOpacity>
        <Button
          title="Return to Current Contacts"
          style={{fontSize: 20, color: '#4faadb'}}
          onPress={ () => {
          this.props.removeFound()
          this.props.navigation.navigate('Current Contacts')}}/>
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
  rowContainer: {
    flex: 1,
    margin: 30,
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    flexDirection: 'row',
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
    found: state.user.found
  }
  }
  const mapDispatchToProps = dispatch => ({
      // removeContact: (uid) => dispatch(removeContact(uid)),
      search: (email, uid) => dispatch(search(email, uid)),
      addContact: (myId, theirId, status) => dispatch(addContact(myId, theirId, status)),
      removeFound: () => dispatch(removeFound())
  })

export default connect(mapStateToProps, mapDispatchToProps)(FindContact)

