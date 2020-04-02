import React, {Component} from 'react';
import { connect } from 'react-redux';
import {StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput, Button} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {createGroup} from '../../store/user';
import {ListItem, rightElement} from 'react-native-elements';

class CreateGroup extends Component {
  constructor(){
    super()
    this.state = {
      name: '',
      groupees: [],
    }
  }
  componentDidMount () {
    let acceptedContacts = this.props.contacts.filter(el => {
      if (el.status==='accepted') return el
    })
    this.setState(
      {contacts: acceptedContacts,
        inMemoryContacts: acceptedContacts}
    )
  }

  handleSubmit (uid) {
    const users = [...this.state.groupees, uid]
    this.props.createGroup(this.state.name, users, this.props.user.uid)
    this.props.navigation.navigate("Current Groups")
  }
  addToGroup (item) {
    if (!this.state.groupees.includes(item.uid)) {
      let newGroup = [...this.state.groupees, item.uid]
      this.setState({groupees: newGroup})
    }
  }

  renderItem = ({item}) => {
    return (<ListItem
          leftAvatar={{ source: { uri: item.imgURL} }}
          rightElement={<Button title="Add" onPress={() => this.addToGroup(item)} />}
          title={`${item.First} ${item.Last}`}
          subtitle={item.email}
          bottomDivider
          />)
  }

  searchContacts = (value) => {
    const filteredContacts = this.state.inMemoryContacts.filter(contact => {
      let contactLower = (contact.First + ' ' + contact.Last).toLowerCase()
      let searchLower = value.toLowerCase()
      return contactLower.indexOf(searchLower) > -1
    })
    this.setState({contacts: filteredContacts})
  }

  render () {
    if (!this.props.user) {
      return <View><Text>Loading...</Text></View>
    }
    if (!this.props.contacts) {
      return <View>
        <Text>Add Contacts to form a group!</Text>
        <Button title="Find Contacts"
            onPress={() => this.props.navigation.navigate('Find Contact')}
          />
      </View>
    } else {
    return(
      <View>
        <TextInput
          value={this.state.name}
          onChangeText={name => this.setState({name: name})}
          placeholder="Group Name"
        />
        <TouchableOpacity>
          <Text onPress={() => this.handleSubmit(this.props.user.uid)}>Create Group</Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Search"
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
const mapStateToProps = state => {
return {
  user: state.user,
  contacts: state.user.contacts,
}
}
const mapDispatchToProps = dispatch => ({
  createGroup: (name, groupees, myId) => dispatch(createGroup(name, groupees, myId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateGroup)
