import React, {Component} from 'react';
import { connect } from 'react-redux'
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native'
import {ListItem} from 'react-native-elements';

class DisCurrentContacts extends Component {
  render(){
    if (!this.props.contacts) {
      return (
        <View>
          <Text>No current contacts</Text>
          <Button title="Find Contacts"
              onPress={() => this.props.navigation.navigate('FindContact')}
            />
        </View>
      )
    }
    else {
      let contacts = this.props.contacts
      return(
      <View>
        {contacts.map(contact => {
          return <ListItem key={contact.uid}
          // leftAvatar={{ source: { uri: contact.imgURL} }}
          title={`${contact.First} ${contact.Last}`}
          subtitle={contact.email}
          bottomDivider
          onPress={() => this.props.navigation.navigate('SingleContact', {solo: contact})}
          />
        })}
        <Button title="Find Other Contacts"
            onPress={() => this.props.navigation.navigate('FindContact')}
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

  export const CurrentContacts = connect(mapStateToProps)(DisCurrentContacts)

