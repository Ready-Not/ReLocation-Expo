import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Button, SafeAreaView, ScrollView, ActivityIndicator, Dimensions} from 'react-native'
import { connect } from 'react-redux'
import firebase from '../config';
import registerForPushNotificationsAsync from '../utils/notifications'
import { CONTACTS } from 'expo-permissions';
import {getContacts, getGroups, getUser} from '../store/user'
import {Avatar, Divider} from 'react-native-elements'
import Map from './Map'
import MapView from 'react-native-maps'
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

class Profile extends React.Component {
    constructor(){
        super()
        this.state={}
    }
    handleSignout = () => {
        firebase.auth().signOut()
        this.props.navigation.navigate('Login')
    }

    async componentDidMount () {
      registerForPushNotificationsAsync()
        let location = await Location.getCurrentPositionAsync({});
        this.setState({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        })
    }

    render() {
        const {user, contacts, groups} = this.props
        console.log('user from profile', user)
        if (!this.state.latitude) {return(<ActivityIndicator style={styles.container} />)}
        return (
            <ScrollView>
            <View style={styles.container}>
                <View style={styles.container}>
                <Text style={styles.title}>Nice to see you, {user.First}</Text>
                <Text> </Text>
                <View style={styles.buttonContainer}>
                    <Avatar
                    size="xlarge"
                    rounded
                    margin
                    borderColor="#4faadb"
                    borderWidth="5"
                    source={user.imgURL ? {uri: user.imgURL} : { uri: 'https://moonvillageassociation.org/wp-content/uploads/2018/06/default-profile-picture1.jpg',}}
                    />
                </View>

                <View style={styles.container}>
                    <Text style={styles.textBox}>{user.email}</Text>
                </View>

                <View styles={styles.container}>
                    <Text> </Text>
                   <MapView
                   mapType='mutedStandard'
                   style={styles.map}
                   initialRegion={{
                   latitude: Number(`${this.state.latitude}`),
                   longitude: Number(`${this.state.longitude}`),
                   latitudeDelta: 0.008,
                   longitudeDelta: 0.005
                   }}>
                   <MapView.Marker
                    pinColor='#4faadb'
                    coordinate={{
                    latitude: Number(`${this.state.latitude}`),
                    longitude: Number(`${this.state.longitude}`)}}
                    title={`${this.props.user.First}'s current location`}
                    />
                    </MapView>
                </View>

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
                {user.email ? <Button title='Schedule Trip' onPress={() => this.props.navigation.navigate('DummySchedule')}/> : <></>}
            </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'space-around',
      margin: 3,
      padding: 3,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingLeft: 3,
    marginBottom: 3,
},
title: {
    width: '90%',
    margin: 7,
    padding: 7,
    fontSize: 24,
    textAlign: 'center',
    color: '#4faadb',
    fontWeight: 'bold',
},
  textBox: {
      width: '90%',
      margin: 3,
      padding: 3,
      fontSize: 20,
      textAlign: 'left',
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
    map: {
    borderWidth: 5,
    borderColor: '#4faadb',
    width: Dimensions.get('window').width/1.25,
    height: Dimensions.get('window').width/1.1,
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
