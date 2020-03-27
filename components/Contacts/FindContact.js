import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Actions} from 'react-native-router-flux';

class FindContact extends Component {
  constructor () {
    super()
    this.state={}
    this.handleSubmit=this.handleSubmit.bind(this)
  }

  searchOne (email) {
    this.props.search(email)
  }
  sendInvite () {
    //figure out a way to send that user an invite to connect, if accepted, put in database using this.state.found
  }

  render() {
    // let currentContacts = this.state.user.associatedUsers
    if (!this.props.found) {return(
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
        <Text>{this.props.found.first} {this.props.found.last}</Text>
        <Text>{this.props.found.email}</Text>
        <TouchableOpacity>
          <Text onPress={this.sendInvite}>Send Invite</Text>
        </TouchableOpacity>
      </View>
    )}
  }
}

const mapStateToProps = () => {
  return {
    user: state.user,
    contacts: state.user.contacts,
    found: state.user.found
  }
  }
  const mapDispatchToProps = dispatch => {
    return {
      removeContact: (uid) => dispatch(removeContact(uid)),
      search: (email) => dispatch(search(email)),
      addContact: (uid) => dispatch(addContact(uid)),
    }
  }

  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(FindContact)
