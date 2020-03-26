import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ListItem} from 'react-native';
import {Actions} from 'react-native-router-flux';

const CurrentContacts = () => {
    let contacts = this.state.user.associatedUsers
    //or however we put a user's contacts on state/in storage
    return(
      <View>
        {contacts.map(contact => {
          return <ListItem key={contact.uid}
          leftAvatar={{ source: { uri: contact.imgURL} }}
          title={`${contact.first} ${contact.last}`}
          subtitle={contact.email}
          bottomDivider
          // onPress={NAV_TO_SOLO_CONTACT with props solo=contact}
          />
        })}
      </View>
    )
}

export default CurrentContacts
