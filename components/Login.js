import React, {Component} from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Button } from 'react-native';
import firebase from '../config';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { updateEmail, updatePassword, login } from '../store/user'

class Login extends React.Component {

  //Right now it is going to forward you to the Profile page, even if signup is not sucessfull
  //TBD: show errors if could not sign user up
  handleLogin = () => {
    this.props.login()
    this.props.navigation.navigate('Profile')
}

  render() {
      return (
          <View style={styles.container}>
              <TextInput
                  style={styles.inputBox}
                  value={this.props.user.email}
                  onChangeText={email => this.props.updateEmail(email)}
                  placeholder='Email'
                  autoCapitalize='none'
              />
              <TextInput
                  style={styles.inputBox}
                  value={this.props.user.password}
                  onChangeText={password => this.props.updatePassword(password)}
                  placeholder='Password'
                  secureTextEntry={true}
              />
              <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText} onPress={this.handleLogin}>Login</Text>
              </TouchableOpacity>
              <Button title="Don't have an account yet? Sign up"
              onPress={() => this.props.navigation.navigate('Signup')}
              />
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

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ updateEmail, updatePassword, login }, dispatch)
}

const mapStateToProps = state => {
  return {
      user: state.user
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)
