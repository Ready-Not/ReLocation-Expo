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
  sendInvite (uid) {
    //figure out a way to send that user an invite to connect, if accepted, put in database
  }

  render() {
    // let currentContacts = this.state.user.associatedUsers
    if (!this.state.found) {return(
      <View>
        <TextInput
            onChangeText={email => this.setState({email})}
            placeholder="Enter email"
          />

          <TouchableOpacity>
            <Text onPress={this.search}> 🔍 </Text>
          </TouchableOpacity>
      </View>
    )} else {return(
      <View>
        {/* <Image src={this.state.found.imgURL}/> */}
        <Textx>{this.state.found.first} {this.state.found.last}</Textx>
        <Text>{this.state.found.email}</Text>
        <TouchableOpacity>
          <Text onPress={() => this.sendInvite(this.state.found.uid)}>Send Invite</Text>
        </TouchableOpacity>
      </View>
    )}
  }
}

export default FindContact
