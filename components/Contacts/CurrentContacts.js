import React, {Component} from 'react';
import { connect } from 'react-redux'
import { View, Text, StyleSheet, TouchableOpacity, Button, ActivityIndicator } from 'react-native'
import {ListItem, rightElement} from 'react-native-elements';
import {getUser} from '../../store/user';

class DisCurrentContacts extends Component {

  componentDidMount () {
    this.props.getUser(this.props.user.uid)
  }

  render(){
    if (!this.props.contacts) {
      return (
        <View style={styles.container}>
          <Text style={styles.textBox}>No current contacts</Text>
          <TouchableOpacity style={styles.button}>
            <Text onPress={() => this.props.navigation.navigate('Find Contact')} style={styles.buttonText}>Find Contacts</Text>
          </TouchableOpacity>
        </View>
      )
    }
    else {
      const contacts = this.props.contacts.filter(el => {if (el.status==='accepted') return el})
      const pending = this.props.contacts.filter(el => {if (el.status==='pending') return el})
      const requested = this.props.contacts.filter(el => {if (el.status==='requested') return el})
      return(
      <View>
        {contacts.length ? <View><Text style={styles.textBox}>Your Contacts</Text>
        {contacts.map(contact => {
          return <ListItem key={contact.uid}
          leftAvatar={{ source: { uri: contact.imgURL} }}
          rightElement={'>'}
          title={`${contact.First} ${contact.Last}`}
          subtitle={contact.email}
          bottomDivider
          onPress={() => this.props.navigation.navigate('Contact', {solo: contact})}
          />
        })}</View> : <Text> </Text>}
        {pending.length ? <View><Text style={styles.textBox}>Pending Contacts</Text>
        {pending.map(contact => {
          return <ListItem key={contact.uid}
          leftAvatar={{ source: { uri: contact.imgURL} }}
          rightElement={<Text>></Text>}
          title={`${contact.First} ${contact.Last}`}
          subtitle={contact.email}
          bottomDivider
          onPress={() => this.props.navigation.navigate('Contact', {solo: contact})}
          />
        })}</View> : <Text></Text>}
        {requested.length ? <View><Text style={styles.textBox}>Requested Contacts</Text>
        {requested.map(contact => {
          return <ListItem key={contact.uid}
          leftAvatar={{ source: { uri: contact.imgURL} }}
          rightAvatar={{source: {uri: 'https://svgsilh.com/png-1024/40166.png'}}}
          title={`${contact.First} ${contact.Last}`}
          subtitle={contact.email}
          bottomDivider
          onPress={() => this.props.navigation.navigate('Contact', {solo: contact})}
          />
        })}</View> : <Text></Text>}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText} onPress={() => this.props.navigation.navigate('Find Contact')}>Add More Contacts</Text>
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
  }
  }
const mapDispatchToProps = dispatch => {
  return {
    getUser: (uid) => dispatch(getUser(uid))
  }
}

  export const CurrentContacts = connect(mapStateToProps, mapDispatchToProps)(DisCurrentContacts)

