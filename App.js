// import React from 'react';
// import { StyleSheet, Text, View } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });


/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import {Header, Colors} from 'react-native/Libraries/NewAppScreen';
import Config from 'react-native-config';
import Welcome from './components/Welcome';
import Notifications from './components/Notifications';
import DataBaseTest from './components/DataBaseTest';
import firebase from 'firebase';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

//To solve "can't find variable atob" error
import {decode, encode} from 'base-64'
if (!global.btoa) {  global.btoa = encode }
if (!global.atob) { global.atob = decode }

const Stack = createStackNavigator();

class App extends Component {
  constructor({navigation}) {
    super({navigation});
  }
  componentDidMount() {
    //I think once we figure out storing secrets, this entire object could be inside that folder and we could just import it here
    // firebase.initializeApp(Config.FIREBASE_CONFIG);
    // const auth = firebase.auth();
    // const db = firebase.firestore();
    // db.settings({timestampsInSnapshots: true});
    // auth.onAuthStateChanged(user => {
    //   //this will tell us if a user is logged in
    //   //i think we need to set up a redux link so that as soon as we configure firestore, we can immediately pass on that data and have it available to other pages
    // });
  }

  render() {
    //this first if statement will work once we have a user
    // if (!user.uid) {
    //   return (
    //     <NavigationNativeContainer>
    //       <Stack.Navigator
    //         screenOptions={{
    //           gestureEnabled: true,
    //           gestureDirection: 'horizontal',
    //         }}
    //         headerMode="float">
    //         <Stack.Screen name="Welcome" component={Welcome} />
    //       </Stack.Navigator>
    //     </NavigationNativeContainer>
    //   );
    // } else {
      return (
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              gestureEnabled: true,
              gestureDirection: 'horizontal',
            }}
            headerMode="float">
            <Stack.Screen name="DataBaseTest" component={DataBaseTest} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
  }
// }

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
