import React, {Component} from 'react';
import { connect } from 'react-redux';
import {StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput, Button} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {createGroup} from '../../store/user';
import {ListItem} from 'react-native-elements';

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
    this.props.createGroup(this.state.name, this.state.groupees)
    this.props.navigation.goBack()
    //send all the users notifications that they've been added to a new group with name ___ (and maybe who added them)
  }
  addToGroup (item) {
    if (!this.state.groupees.includes(item.uid)) {
      let newGroup = [...this.state.groupees, item.uid]
      this.setState({groupees: newGroup})
    }
    console.log('from addtoGroup', this.state.groupees)
  }

  renderItem = ({item}) => {
    // return (
    //   <View>
    //     <Text>{item.First} {item.Last}</Text>
    //     <Button title="Add" onPress={this.addToGroup(item)} />
    //   </View>
    // )

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
  createGroup: (name, groupees) => dispatch(createGroup(name, groupees)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateGroup)
