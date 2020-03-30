import React, {Component} from 'react';
import {connect} from 'react-redux'
import {StyleSheet, Text, View, TouchableOpacity, ListItem, Button} from 'react-native';
import {Actions} from 'react-native-router-flux';
import { render } from 'react-dom';

class CurrentContacts extends Component {

  render(){
    let contacts = this.props.contacts
    if (contacts) {return(
      <View>
        {contacts.map(contact => {
          return <ListItem key={contact.uid}
          leftAvatar={{ source: { uri: contact.imgURL} }}
          title={`${contact.first} ${contact.last}`}
          subtitle={contact.email}
          bottomDivider
          onPress={this.props.navigation.navigate('SingleContact', {solo: contact})}
          />
        })}
        <Button title="Find Contacts"
            onPress={() => this.props.navigation.navigate('FindContact')}
          />
      </View>
    )} else {return (
      <View>
        <Text>No current contacts</Text>
        <Button title="Find Contacts"
            onPress={() => this.props.navigation.navigate('FindContact')}
          />
      </View>)}
  }
}
const mapStateToProps = () => {
  return {
    user: state.user,
    contacts: state.user.contacts,
  }
  }
  const mapDispatchToProps = dispatch => {
    return{}
  }
  connect(mapStateToProps, mapDispatchToProps)(CurrentContacts)
  export default CurrentContacts

