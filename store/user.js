import firebase, {firestore} from '../config'

// import AsyncStorage from '@react-native-community/async-storage';

export const LOGIN = 'LOGIN'
export const SIGNUP = 'SIGNUP'
export const UPDATE_PASSWORD = 'UPDATE_PASSWORD'
export const UPDATE_EMAIL = 'UPDATE_EMAIL'


/**
 * ACTION CREATORS
 */


/**
 * THUNK CREATORS
 */

export const updateEmail = email => {
  return {
      type: UPDATE_EMAIL,
      payload: email
  }
}

export const updatePassword = password => {
  return {
      type: UPDATE_PASSWORD,
      payload: password
  }
}

export const login = () => {
  return async (dispatch, getState) => {
      try {
          const { email, password } = getState().user
          console.log('from LOGIN THUNK', email, password)
          const response = await firebase.auth().signInWithEmailAndPassword(email, password)
          dispatch(getUser(response.user.uid))
      } catch (e) {
          alert(e)
      }
  }
}

export const getUser = uid => {
  return async (dispatch, getState) => {
      try {
          const user = await firestore
              .collection('users')
              .doc(uid)
              .get()
          dispatch({ type: LOGIN, payload: user.data() })
      } catch (e) {
          alert(e)
      }
  }
}

export const signup = (newUser) => {
  return async (dispatch, getState) => {
      try {
        const { email, password } = getState().user
        console.log('from SIGNUP THUNK', email, password)
          const response = await firebase.auth().createUserWithEmailAndPassword(email, password)
          if (response.user.uid) {
            const user = {
                uid: response.user.uid,
                email: email,
                First: newUser.firstName,
                Last: newUser.lastName
            }
            firestore.collection('users')
                .doc(response.user.uid)
                .set(user)

            dispatch({ type: SIGNUP, payload: user })
        }
      } catch (e) {
          alert(e)
      }
  }
}

