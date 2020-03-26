import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import firebase from '../config';

class Profile extends React.Component {
    handleSignout = () => {
        firebase.auth().signOut()
        this.props.navigation.navigate('Login')
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.textBox}>My Profile:</Text>
                <Text style={styles.textBox}>First name: {this.props.user.First}</Text>
                <Text style={styles.textBox}>Last name: {this.props.user.Last}</Text>
                <Text style={styles.textBox}>Email: {this.props.user.email}</Text>

                {/* This is a temporary code just to make sure location APIs are connected and working */}
                <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('Map')}>
                <Text style={styles.buttonText}>Test location</Text>
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
        user: state.user
    }
}

export default connect(mapStateToProps)(Profile)
