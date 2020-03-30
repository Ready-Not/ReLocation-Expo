import React, {Component} from 'react';
import { connect } from 'react-redux';
import {StyleSheet, Text, View, TouchableOpacity, ListItem, FlatList, TextInput, Button} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {createGroup} from '../../store/user';

class CreateGroup extends Component {
  constructor(){
    super()
    this.state={
      name: '',
      groupees: [],
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
    this.props.createGroup(this.state.name, [...this.state.groupees, user.uid])
    this.props.navigation.goBack()
    //send all the users notifications that they've been added to a new group with name ___ (and maybe who added them)
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
    if (!this.props.contacts) {
      return <View>
        <Text>Add Contacts to form a group!</Text>
        <Button title="Find Contacts"
            onPress={() => this.props.navigation.navigate('FindContact')}
          />
      </View>
    } else {
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
    )}
  }
}
const mapStateToProps = () => {
return {
  user: state.user,
  contacts: state.user.contacts,
}
}
const mapDispatchToProps = dispatch => {
return {
  createGroup: (name, groupees) => dispatch(createGroup(name, groupees)),
}
}

 connect(mapStateToProps, mapDispatchToProps)(CreateGroup)
 export default CreateGroup
