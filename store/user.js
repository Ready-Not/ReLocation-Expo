import firebase from 'firebase';
import Config from 'react-native-config';
const app = firebase.initializeApp({
  apiKey: Config.FIREBASE_CONFIG,
  authDomain: "relocation-1ac3d.firebaseapp.com",
  databaseURL: "https://relocation-1ac3d.firebaseio.com",
  projectId: "relocation-1ac3d",
  storageBucket: "relocation-1ac3d.appspot.com",
  messagingSenderId: "658430192184",
  appId: "1:658430192184:web:c6107a992d238aba7e14cd",
  measurementId: "G-7HQ5Q3MTH5"
});
// const auth = app.auth();
export const db = app.database();
// db.settings({timestampsInSnapshots: true});
import AsyncStorage from '@react-native-community/async-storage';

const GET_USER = 'GET_USER';
const REMOVE_USER = 'REMOVE_USER';

const initialState = {};

/**
 * ACTION CREATORS
 */
const getUser = user => ({type: GET_USER, user});
const removeUser = () => ({type: REMOVE_USER});

/**
 * THUNK CREATORS
 */
export const gotUser = () => async dispatch => {
  try {
    const user = await AsyncStorage.getItem('user');
    dispatch(getUser(user));
  } catch (err) {
    console.error(err);
  }
};

export const login = (email, password) => async dispatch => {
  try {
    const {user} = await db.signInWithEmailAndPasswordd(email, password);
    if (user) {
      await AsyncStorage.setItem('user', user);
      gotUser();
      //figure out way to get them back to welcome page
    }
  } catch (err) {
    console.error(err);
  }
};

export const signUp = signupDetails => async dispatch => {
  try {
    const {first, last, email, password} = signupDetails;
    const {user} = await db.createUserWithEmailAndPassword(email, password);
    user.First = first;
    user.Last = last;
    await AsyncStorage.setItem('user', user);
    gotUser();
    //figure out way to get them back to welcome page
  } catch (err) {
    console.error(err);
  }
};

export const logout = () => async dispatch => {
  try {
    await db.signout();
    await AsyncStorage.removeUser('user');
    dispatch(removeUser());
    // history.push('/login') figure out Navigation equivalent to this
  } catch (err) {
    console.error(err);
  }
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_USER:
      return action.user;
    case REMOVE_USER:
      return initialState;
    default:
      return state;
  }
}
