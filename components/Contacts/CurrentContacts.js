import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ListItem} from 'react-native';
import {Actions} from 'react-native-router-flux';

const CurrentContacts = () => {
    let {contacts} = this.props

    return(
      <View>
        {contacts.map(contact => {
          return <ListItem key={contact.uid}
          leftAvatar={{ source: { uri: contact.imgURL} }}
          title={`${contact.first} ${contact.last}`}
          subtitle={contact.email}
          bottomDivider
          // onPress={this.props.navigation.navigate('SingleContact')}
          />
        })}
      </View>
    )
}
const mapStateToProps = () => {
  return {
    user: state.user,
    contacts: state.user.contacts,
  }
  }
  const mapDispatchToProps = dispatch => {

  }

  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(CurrentContacts)
