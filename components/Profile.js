import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Button, SafeAreaView} from 'react-native'
import { connect } from 'react-redux'
import firebase from '../config';
import registerForPushNotificationsAsync from '../utils/notifications'
import { CONTACTS } from 'expo-permissions';
import {getContacts, getGroups, getUser} from '../store/user'
import {Avatar, Divider} from 'react-native-elements'

class Profile extends React.Component {
    handleSignout = () => {
        firebase.auth().signOut()
        this.props.navigation.navigate('Login')
    }

    componentDidMount () {
      registerForPushNotificationsAsync()
      this.setState({
          First: this.props.user.First,
          Last: this.props.user.Last,
          email: this.props.user.email,
      })
    }

    render() {
        const {user, contacts, groups} = this.props
        return (
            <View style={styles.container}>
                <View style={styles.container}>
                <Text style={styles.textBox}>Nice to see you, {user.First}</Text>
                <Avatar
                  size="xlarge"
                  rounded
                  borderColor="#4faadb"
                  borderWidth="5"
                  source={user.imgURL ? user.imgURL : { uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',}}
                />
                <Text style={styles.textBox}>First name: {user.First}</Text>
                <Text style={styles.textBox}>Last name: {user.Last}</Text>
                <Text style={styles.textBox}>Email: {user.email}</Text>
                </View>
                {/* <Divider style={{backgroundColor: "#4faadb"}} /> */}

                {/* This is a temporary code just to make sure location APIs are connected and working */}
                {/* <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('Map')}>
                <Text style={styles.buttonText}>Test location</Text>
                </TouchableOpacity> */}
                <View style={styles.buttonContainer}>
                <View style={styles.container}>
                <TouchableOpacity style={styles.button}
                onPress={() => this.props.navigation.navigate('Start Trip')}>
                <Text style={styles.buttonText}>Start a Trip</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button}
                onPress={() => this.props.navigation.navigate('All Trips')}>
                <Text style={styles.buttonText}>My Trips</Text>
                </TouchableOpacity>
                </View>
                <View style={styles.container}>
                <TouchableOpacity style={styles.button}
                onPress={() => this.props.navigation.navigate('Current Groups')}>
                 <Text style={styles.buttonText}>My Groups</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button}
                onPress={() => this.props.navigation.navigate('Current Contacts')}>
                 <Text style={styles.buttonText}>My Contacts</Text>
                </TouchableOpacity>
                </View>
                </View>
                <TouchableOpacity style={styles.logout} onPress={this.handleSignout}>
                <Text style={styles.logoutText}>Logout</Text>
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
      justifyContent: 'space-around'
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around'
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
      width: 160
  },
  buttonText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff'
  },
  logout: {
    marginTop: 5,
    marginBottom: 50,
    paddingVertical: 5,
    alignItems: 'center',
    backgroundColor: '#417794',
    borderColor: '#417794',
    borderWidth: 0,
    borderRadius: 5,
    width: 225
},
logoutText: {
    fontSize: 20,
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
