import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Actions} from 'react-native-router-flux';

class FindContact extends Component {
  constructor () {
    super()
    this.state={}
    this.handleSubmit=this.handleSubmit.bind(this)
  }

  search (email) {
    //do a database lookup to find anyone with that email
    //if exists, this.setState{found:user}
  }
  sendInvite () {
    //figure out a way to send that user an invite to connect, if accepted, put in database using this.state.found
  }

  render() {
    // let currentContacts = this.state.user.associatedUsers
    if (!this.state.found) {return(
      <View>
        <TextInput
            onChangeText={email => this.setState({email})}
            placeholder="Enter email"
            placeholderTextColor="#ddddddd"
          />

          <TouchableOpacity>
            <Text onPress={this.search}> 🔍 </Text>
          </TouchableOpacity>
      </View>
    )} else {return(
      <View>
        {/* <Image src={this.state.found.imgURL}/> */}
        <Text>{this.state.found.first} {this.state.found.last}</Text>
        <Text>{this.state.found.email}</Text>
        <TouchableOpacity>
          <Text onPress={this.sendInvite}>Send Invite</Text>
        </TouchableOpacity>
      </View>
    )}
  }
}

export default FindContact
