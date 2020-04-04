import React, {Component} from 'react';
import { connect } from 'react-redux';
import {StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput, Button} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {createGroup} from '../../store/user';
import {ListItem, rightElement, Divider} from 'react-native-elements';

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
          rightElement={<Button title={this.state.groupees.includes(item.uid) ? "Added" : "Add"} onPress={() => this.addToGroup(item)} />}
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
      return <View style={styles.container}><Text style={styles.textBox}>Loading...</Text></View>
    }
    if (!this.props.contacts) {
      return <View style={styles.container}>
        <Text style={styles.textBox}>Add Contacts to form a group!</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText} onPress={() => this.props.navigation.navigate('Find Contact')} >Find Contacts</Text>
        </TouchableOpacity>
      </View>
    } else {
    return(
      <View>
        <Text style={styles.textBox}>Enter details below</Text>
        <Divider backgroundColor='#4faadb' width='80%' alignSelf='center'/>
        <View style={styles.rowContainer}>
          <Text style={{fontSize: 20}}>Group Name:</Text>
          <TextInput
            fontSize='20'
            value={this.state.name}
            onChangeText={name => this.setState({name: name})}
            placeholder="Enter Name"
          />
        </View>
        <Divider backgroundColor='#4faadb' width='30%' alignSelf='center'/>
        <Text style={styles.textBox}>Add Members:</Text>
        <TextInput
          fontSize='20'
          padding="3%"
          placeholder="Search Contacts..."
          onChangeText={(value)=> this.searchContacts(value)}
        />
        <FlatList
          data={this.state.contacts}
          renderItem={this.renderItem}
          keyExtractor={(item)=> item.uid}
          ListEmptyComponent={() => (
          <View>
            <Text style={styles.textBox}>No Contacts Found</Text>
          </View>)}
        />
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText} onPress={() => this.handleSubmit(this.props.user.uid)}>Create Group</Text>
        </TouchableOpacity>
      </View>
    )}
  }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'flex-start'
  },
  rowContainer: {
    margin: 10,
    padding: 10,
    flexDirection: 'row',
    fontSize: 20,
    justifyContent: 'space-between'
},
  textBox: {
      width: '90%',
      margin: 5,
      padding: 5,
      fontSize: 20,
      textAlign: 'center',
  },
  button: {
      marginTop: 10,
      marginBottom: 10,
      paddingVertical: 5,
      alignItems: 'center',
      backgroundColor: '#4faadb',
      borderColor: '#4faadb',
      borderWidth: 1,
      borderRadius: 5,
      width: 250,
      alignSelf: 'center'
  },
  buttonText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff'
  },
})

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
