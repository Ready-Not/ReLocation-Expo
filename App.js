import React, {Component} from 'react';

import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import reducer from './store'

import Login from './components/Login';
import Signup from './components/Signup';
import Profile from './components/Profile';
import MyMaps from './components/Map';
import TrackForm from './components/Tracks/CreateTrack';
import AllTracks from './components/Tracks/CurrentTracks';
import SingleTrack from './components/Tracks/SingleTrack';
import SingleContact from './components/Contacts/SingleContact';
import FindContact from './components/Contacts/FindContact';
import {CurrentContacts} from './components/Contacts/CurrentContacts';
import SingleGroup from './components/Groups/SingleGroup';
import CreateGroup from './components/Groups/CreateGroup';
import CurrentGroups from './components/Groups/CurrentGroups';
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
      <Stack.Screen name="TrackForm" component={TrackForm} />
      <Stack.Screen name="AllTracks" component={AllTracks} />
      <Stack.Screen name="SingleTrack" component={SingleTrack} />
      <Stack.Screen name="CurrentContacts" component={CurrentContacts} />
      <Stack.Screen name="SingleContact" component={SingleContact} />
      <Stack.Screen name="FindContact" component={FindContact} />
      <Stack.Screen name="CurrentGroups" component={CurrentGroups} />
      <Stack.Screen name="SingleGroup" component={SingleGroup} />
      <Stack.Screen name="CreateGroup" component={CreateGroup} />
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
