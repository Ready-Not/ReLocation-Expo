import React, {Component} from 'react';
import { connect } from 'react-redux'
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native'
import {ListItem, rightElement} from 'react-native-elements';
import {getUser} from '../../store/user'

class DisCurrentContacts extends Component {

  componentDidMount () {
    this.props.getUser(this.props.user.uid)
    console.log('cdm', this.props.user.associatedUsers)
  }

  render(){
    if (!this.props.contacts) {
      return (
        <View>
          <Text>No current contacts</Text>
          <Button title="Find Contacts"
              onPress={() => this.props.navigation.navigate('Find Contact')}
            />
        </View>
      )
    }
    else {
      const contacts = this.props.contacts.filter(el => {if (el.status==='accepted') return el})
      const pending = this.props.contacts.filter(el => {if (el.status==='pending') return el})
      const requested = this.props.contacts.filter(el => {if (el.status==='requested') return el})
      return(
      <View>
        {contacts.length ? <View><Text>Your Contacts</Text>
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
        {pending.length ? <View><Text>Pending Contacts</Text>
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
        {requested.length ? <View><Text>Requested Contacts</Text>
        {requested.map(contact => {
          return <ListItem key={contact.uid}
          leftAvatar={{ source: { uri: contact.imgURL} }}
          rightElement={'>'}
          title={`${contact.First} ${contact.Last}`}
          subtitle={contact.email}
          bottomDivider
          onPress={() => this.props.navigation.navigate('Contact', {solo: contact})}
          />
        })}</View> : <Text></Text>}
        <Button title="Add More Contacts"
            onPress={() => this.props.navigation.navigate('Find Contact')}
          />
      </View>
    )}
  }
}
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

