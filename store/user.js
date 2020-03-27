import firebase, {firestore} from '../config'
import { checkForUpdateAsync } from 'expo/build/Updates/Updates'

// import AsyncStorage from '@react-native-community/async-storage';

export const LOGIN = 'LOGIN'
export const SIGNUP = 'SIGNUP'
export const UPDATE_PASSWORD = 'UPDATE_PASSWORD'
export const UPDATE_EMAIL = 'UPDATE_EMAIL'
export const GET_CONTACTS = 'GET_CONTACTS'
export const GET_GROUPS = 'GET_GROUPS'
export const SEARCH = 'SEARCH'
export const CREATE_GROUP = 'CREATE_GROUP'
export const LEAVE_GROUP = 'LEAVE_GROUP'

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
              dispatch(getContacts(user.data().associatedUsers))
              dispatch(getGroups(user.data().uid))
      } catch (e) {
          alert(e)
      }
  }
}

export const search = email => {
  return async dispatch => {
    try {
      const user = await firestore.collection('users').where('email', '===', email).get()
      if(user) dispatch({type: SEARCH, payload: user.data()})
      else dispatch({type: SEARCH, payload: 'No user by that name exists'})
    } catch(e) {console.log(e)}
  }
}

export const createGroup = (name, groupees) => {
  return async dispatch => {
    try {
      const group = await firestore.collection('groups').doc().set({name: name, usersInGroup: groupees, groupId: it.id})
      if (group) dispatch({type: CREATE_GROUP, payload: group.data()})
    } catch(e) {alert(e)}
  }
}
export const leaveGroup = (groupId, uid) => {
  return async dispatch => {
    try {
      const group = await firestore.collection('groups').doc(groupId).get()
      const toModify = group.data()
      const updated = toModify.usersInGroup.filter(el => {
        if (el !== uid) return el
      })
      const newGroup = await firestore.collection('groups').doc(groupId).set(updated)
      if (newGroup) dispatch({type: LEAVE_GROUP, payload: newGroup.data()})
    } catch(e) {alert(e)}
  }
}

export const getContacts = arr => {
  return async (dispatch, getState) => {
    try {
      let allContacts = []
      const contacts = Promise.all(arr.map( el => {
        const user = firestore.collection('users').doc(el.userRef).get()
        return user
      }))
      ;(await contacts).forEach(el => allContacts.push(el.data()))
      const finalContacts = allContacts.map((user, i) => {
        return {
          First: user.First,
          Last: user.Last,
          email: user.email,
          imgURL: user.imgURL,
          canTrack: arr[i].canTrack,
          uid: user.uid
        }
      })
      dispatch({type: GET_CONTACTS, payload: finalContacts})
    } catch(e) {alert(e)}
  }
}

export const getGroups = uid => {
  return async (dispatch, getState) => {
    try {
      let allGroupsArr = []
      const allGroups = await firestore.collection('groups').get()
      allGroups.forEach(group => {
      allGroupsArr.push(group.data())
      })
      const filtered = allGroupsArr.filter(group => {
        if (group.usersInGroup.includes(uid)) return group
      })
      console.log(filtered)
      dispatch({type: GET_GROUPS, payload: filtered})
    } catch(e) {alert(e)}
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

