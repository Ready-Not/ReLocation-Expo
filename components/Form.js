import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import {auth} from 'firebase';

//auth is a const declared in App.js that is the authentication from our firestore database, need to make sure it gets here, probably via props, but if we want to use a Redux store, a lot of this may end up changing over to there, so i'm not really doing anything with it here

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  saveData = async () => {
    const {first, last, email, password} = this.state;
    if (this.props.type !== 'Login') {
      // use auth to log in
      const {user} = await auth.createUserWithEmailAndPassword(email, password);
      user.First = first;
      user.Last = last;
      Keyboard.dismiss();
      // eslint-disable-next-line no-alert
      alert(`Thank you for signing up, ${first}`);
      // this.textInput.clear()
    } else if (this.props.type === 'Login') {
      const {user} = await auth.signInWithEmailAndPasswordd(email, password);
      //side note: auth.signout()
      this.textInput.clear()
      if (!user) {
        // eslint-disable-next-line no-alert
        alert('Email or password does not exist!');
      }
    }
  };

  render() {
    if (this.props.type !== 'Login') {
      return (
        <View>
          <TextInput
            onChangeText={first => this.setState({first})}
            placeholder="First Name"
            onSubmitEditing={() => this.last.focus()}
          />
          <TextInput
            onChangeText={last => this.setState({last})}
            placeholder="Last Name"
            onSubmitEditing={() => this.email.focus()}
          />
          <TextInput
            onChangeText={email => this.setState({email})}
            placeholder="Email"
            keyboardType="email-address"
            onSubmitEditing={() => this.password.focus()}
          />

          <TextInput
            onChangeText={password => this.setState({password})}
            placeholder="Password"
            secureTextEntry={true}
            ref={input => (this.password = input)}
          />

          <TouchableOpacity>
            <Text onPress={this.saveData}>{this.props.type}</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View>
          <TextInput
            onChangeText={email => this.setState({email})}
            placeholder="Email"
            keyboardType="email-address"
            onSubmitEditing={() => this.password.focus()}
          />
          <TextInput
            onChangeText={password => this.setState({password})}
            placeholder="Password"
            secureTextEntry={true}
            ref={input => (this.password = input)}
          />
          <TouchableOpacity>
            <Text onPress={this.saveData}>{this.props.type}</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
}

export default Form;
