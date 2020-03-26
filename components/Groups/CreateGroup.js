import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ListItem} from 'react-native';
import {Actions} from 'react-native-router-flux';
//I realized that I wasn't sure how we want to add people to a group, do we want all contacts with a button saying adD? do we want a series of text inputs where they invite people on submit?


class CreateGroup extends Component {
  constructor(){
    super()
    this.state={
      name: '',
      invitees: []
    }
  }

  handleSubmit () {
    //figure out a way to
  }

  render(){
    return(
      <View>
        <TextInput
          onChangeText={name => this.setState({name})}
          placeholder="Group Name"
        />
        <TextInput
          onChangeText={invites => this.setState({invites})}
          placeholder="Invite Friends to join"
        />
        <TouchableOpacity>
          <Text onPress={this.handleSubmit}>Create Group</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default CreateGroup
