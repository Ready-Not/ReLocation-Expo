import React, {Component} from 'react';
import { connect } from 'react-redux'
import {StyleSheet, Text, View, TouchableOpacity, TextInput} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {search, addContact, removeFound} from '../../store/user';

class FindContact extends Component {
  constructor () {
    super()
    this.state={}
  }

  sendInvite () {
    //figure out a way to send that user an invite to connect, if accepted, put in database using found
  }

  render() {
    // let currentContacts = this.state.user.associatedUsers
    if (!this.props.found) {return(
      <View>
        <TextInput
            onChangeText={email => this.setState({email})}
            placeholder="Enter email"
            placeholderTextColor="#ddd"
          />

          <TouchableOpacity>
            <Text onPress={() => this.props.search(this.state.email)}> 🔍 </Text>
          </TouchableOpacity>
      </View>
    )} else if (this.props.found.error) {return(
      <View>
      {/* <Image src={this.state.found.imgURL}/> */}
      <Text>{this.props.found.error}</Text>
      <TouchableOpacity>
        <Text onPress={this.sendInvite}>Send Invite</Text>
      </TouchableOpacity>
    </View>
    )} else {return(
      <View>
        {/* <Image src={this.state.found.imgURL}/> */}
        <Text>{this.props.found.First} {this.props.found.Last}</Text>
        <Text>{this.props.found.email}</Text>
        <TouchableOpacity>
        <Text onPress={ () => {
          this.props.removeFound()
          this.props.navigation.navigate('CurrentContacts')}}>Go back to all current contacts</Text>
      </TouchableOpacity>
      </View>
    )}
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    contacts: state.user.contacts,
    found: state.user.found
  }
  }
  const mapDispatchToProps = dispatch => ({
      // removeContact: (uid) => dispatch(removeContact(uid)),
      search: (email) => dispatch(search(email)),
      addContact: (uid) => dispatch(addContact(uid)),
      removeFound: () => dispatch(removeFound())
  })

export default connect(mapStateToProps, mapDispatchToProps)(FindContact)

