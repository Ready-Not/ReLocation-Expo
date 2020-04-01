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
      <View style={styles.container}>
        <TextInput
            style={styles.inputBox}
            onChangeText={email => this.setState({email})}
            placeholder="Enter email"
            placeholderTextColor="#ddd"
          />

          <TouchableOpacity>
            <Text
            style={{padding: 30}}
            onPress={() => this.props.search(this.state.email)}> 🔍 </Text>
          </TouchableOpacity>
      </View>
    )} else if (this.props.found.error) {return(
      <View style={styles.container}>
      {/* <Image src={this.state.found.imgURL}/> */}
      <Text style={styles.textBox}>{this.props.found.error}</Text>
      <TouchableOpacity>
        <Text onPress={this.sendInvite}>TBD: Send Invite</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text
          style={styles.buttonText}
          onPress={ () => {
          this.props.removeFound()
          this.props.navigation.navigate('CurrentContacts')}}>Go back to AllContacts</Text>
      </TouchableOpacity>
    </View>
    )} else {return(
      <View style={styles.container}>
        {/* <Image src={this.state.found.imgURL}/> */}
        <Text style={styles.textBox}>{this.props.found.First} {this.props.found.Last}</Text>
        <Text style={styles.textBox}>{this.props.found.email}</Text>
        <Text style={styles.textBox}>TBD: status/relationship to me, actions</Text>
        <TouchableOpacity style={styles.button}>
        <Text
          style={styles.buttonText}
          onPress={ () => {
          this.props.removeFound()
          this.props.navigation.navigate('CurrentContacts')}}>Go back to AllContacts</Text>
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
  inputBox: {
    width: '85%',
    margin: 10,
    padding: 15,
    fontSize: 16,
    borderColor: '#d3d3d3',
    borderBottomWidth: 1,
    textAlign: 'center'
},
  textBox: {
      width: '85%',
      margin: 10,
      padding: 15,
      fontSize: 16,
      textAlign: 'center'
  },
  button: {
      marginTop: 30,
      marginBottom: 20,
      paddingVertical: 5,
      alignItems: 'center',
      backgroundColor: '#F6820D',
      borderColor: '#F6820D',
      borderWidth: 1,
      borderRadius: 5,
      width: 200
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

