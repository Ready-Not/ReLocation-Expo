import React, {Component} from 'react';

import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import reducer from './store'

import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import MyMaps from './components/Map'
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

//To solve "can't find variable atob" error
import {decode, encode} from 'base-64'
if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }

const middleware = applyMiddleware(thunkMiddleware)
const store = createStore(reducer, middleware)

const Stack = createStackNavigator();

function LogIn() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Map" component={MyMaps} />
    </Stack.Navigator>
  )
}

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
      return (
        <Provider store={store}>
        <NavigationContainer>
          <LogIn />
        </NavigationContainer>
        </Provider>
      );
    }
  }


export default App;
