import React from 'react'
import { View, Text, StyleSheet, Button } from 'react-native'
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
                <Text>Profile Screen</Text>
                <Text>{this.props.user.email}</Text>
                <Button title='Logout' onPress={this.handleSignout} />
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
  inputBox: {
      width: '85%',
      margin: 10,
      padding: 15,
      fontSize: 16,
      borderColor: '#d3d3d3',
      borderBottomWidth: 1,
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
  buttonSignup: {
      fontSize: 12
  }
})

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(Profile)
