import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native'
import { connect } from 'react-redux'
import firebase from '../config';
import registerForPushNotificationsAsync from '../utils/notifications'
import { CONTACTS } from 'expo-permissions';
import {getContacts, getGroups, getUser} from '../store/user'

class Profile extends React.Component {
    handleSignout = () => {
        firebase.auth().signOut()
        this.props.navigation.navigate('Login')
    }

    componentDidMount () {
      registerForPushNotificationsAsync()
    //   this.props.getContacts(this.props.user.associatedUsers)
    //   this.props.getGroups(this.props.user.uid)
    }

    render() {
        const contacts = this.props.contacts
        const groups = this.props.groups
        return (
            <View style={styles.container}>
                <Text style={styles.textBox}>My Profile:</Text>
                <Text style={styles.textBox}>First name: {this.props.user.First}</Text>
                <Text style={styles.textBox}>Last name: {this.props.user.Last}</Text>
                <Text style={styles.textBox}>Email: {this.props.user.email}</Text>

                {/* This is a temporary code just to make sure location APIs are connected and working */}
                {/* <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('Map')}>
                <Text style={styles.buttonText}>Test location</Text>
                </TouchableOpacity> */}


                <TouchableOpacity style={styles.button}
                onPress={() => this.props.navigation.navigate('Start Trip')}>
                <Text style={styles.buttonText}>"Set-Up a track?"</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button}
                onPress={() => this.props.navigation.navigate('All Trips')}>
                <Text style={styles.buttonText}>"All my trips?"</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button}
                onPress={() => this.props.navigation.navigate('Current Groups')}>
                 <Text style={styles.buttonText}>"My Groups"</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button}
                onPress={() => this.props.navigation.navigate('Current Contacts')}>
                 <Text style={styles.buttonText}>"My Contacts"</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={this.handleSignout}>
                <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>

            </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'flex-start'
  },
  textBox: {
      width: '85%',
      margin: 10,
      padding: 15,
      fontSize: 16,
      textAlign: 'center'
  },
  button: {
      marginTop: 20,
      marginBottom: 10,
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
        groups: state.user.groups
    }
}
const mapDispatchToProps = dispatch => {
    return {
        getContacts: (arr) => dispatch(getContacts(arr)),
        getGroups: (uid) => dispatch(getGroups(uid)),
        getUser: (uid) => dispatch(getUser(uid)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
