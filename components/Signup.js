import React from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Button } from 'react-native'
import firebase from '../config';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { updateEmail, updatePassword, signup } from '../store/user'

class Signup extends React.Component {

  //Right now it is going to forward you to the Profile page, even if signup is not sucessfull
  //TBD: show errors if could not sign user up
  handleSignUp = () => {
    this.props.signup(this.state)
    this.props.navigation.navigate('Profile')
}

    render() {
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.inputBox}
                    // value={this.state.firstName}
                    // onChangeText={firstName => this.setState({ firstName })}
                    placeholder='First Name'
                />
                <TextInput
                    style={styles.inputBox}
                    // value={this.state.lastName}
                    // onChangeText={lastName => this.setState({ lastName })}
                    placeholder='Last Name'
                />
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
                <TouchableOpacity style={styles.button} onPress={this.handleSignUp}>
                    <Text style={styles.buttonText}>Signup</Text>
                </TouchableOpacity>
                <Button title="Already have an account? Login"
                onPress={() => this.props.navigation.navigate('Login')}
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
        backgroundColor: '#FFA611',
        borderColor: '#FFA611',
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
  return bindActionCreators({ signup, updateEmail, updatePassword }, dispatch)
}

const mapStateToProps = state => {
  return {
      user: state.user
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Signup)
