import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ListItem, FlatList} from 'react-native';
import {Actions} from 'react-native-router-flux';
//I realized that I wasn't sure how we want to add people to a group, do we want all contacts with a button saying adD? do we want a series of text inputs where they invite people on submit?


class CreateGroup extends Component {
  constructor(){
    super()
    this.state={
      name: '',
      groupees: [],
      contacts: []
    }
  }
  componentDidMount () {
    this.setState(
      {contacts: this.props.contacts,
      inMemoryContacts: this.props.contacts}
      //assuming we get contacts as props from redux store
    )
  }

  handleSubmit () {
    //figure out a way to create new group in database with groupees/name properties, AND send all the users notifications that they've been added to a new group with name ___ (and maybe who added them)
  }
  addToGroup (item) {
    let group = this.state.groupees
    let newGroup = group.push(item.uid)
    this.setState({groupees: newGroup})
  }

  renderItem = ({item}) => {
    return (
      <View>
        <Text>{item.first} {item.last}</Text>
        <Text onPress={item => this.addToGroup(item)}> + </Text>
      </View>
    )}

  searchContacts = (value) => {
    const filteredContacts = this.state.inMemoryContacts.filter(contact => {
      let contactLower = (contact.first + ' ' + contact.last).toLowerCase()
      let searchLower = value.toLowerCase()
      return contactLower.indexOf(searchLower) > -1
    })
    this.setState({contacts: filteredContacts})
  }

  render () {
    return(
      <View>
        <TextInput
          onChangeText={name => this.setState({name})}
          placeholder="Group Name"
          placeholderTextColor="#ddddddd"
        />
        <TouchableOpacity>
          <Text onPress={this.handleSubmit}>Create Group</Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Search"
          placeholderTextColor="#ddddddd"
          onChangeText={(value)=> this.searchContacts(value)}
        />
        <FlatList
          data={this.state.contacts}
          renderItem={this.renderItem}
          keyExtractor={(item)=> item.uid}
          ListEmptyComponent={() => (
          <View>
            <Text>No Contacts Found</Text>
          </View>)}
        />
      </View>
    )
  }
}

export default CreateGroup
