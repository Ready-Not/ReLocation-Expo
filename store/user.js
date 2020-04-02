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
export const ADD_CONTACT = 'ADD_CONTACT'
export const REMOVE_CONTACT = 'REMOVE_CONTACT'

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

export const search = (email, uid) => {
  return async dispatch => {
    try {
      const userArr = await firestore.collection('users').where('email', '==', email).get()
      if(!userArr.empty) {
        let foundUser
        userArr.forEach(user => {
          foundUser = user.data()
          if (foundUser.associatedUsers) foundUser.associatedUsers.forEach(el => {
            if (el.userRef === uid) {
              foundUser.status = el.status
            }
          })
        })
        dispatch({type: SEARCH, payload: foundUser})
      }
      else {
        dispatch({type: SEARCH, payload: {error: 'No user by that name exists'}})
      }
    } catch(e) {console.log(e)}
  }
}

export const removeFound = () =>  {
  return dispatch => {
  dispatch({type: SEARCH, payload: null})
  }
}

export const createGroup = (name, groupees) => {
  return async dispatch => {
    try {
      const group = await firestore.collection('groups').doc().set({name: name, usersInGroup: groupees})
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
      if (newGroup) {
        if (!newGroup.usersInGroup.inclues(uid)) {alert('You have left the group')}
        dispatch({type: LEAVE_GROUP, payload: newGroup.data()})
      }
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
          status: (arr[i].status)? arr[i].status : 'none',
          uid: user.uid
        }
      })
      dispatch({type: GET_CONTACTS, payload: finalContacts})
    } catch(e) {console.log(e)}
  }
}

export const addContact = (myId, theirId, status) => {
  return async dispatch => {
    try {
      let myNew;
      let theirNew;
      if (status==='requested') {
        //confirm, so change both to accepted
        const myProf = await firestore.collection('users').doc(myId).get()
        const myWorking = myProf.data()
        myWorking.associatedUsers.forEach(el => {
          if (el.userRef===theirId) {
            el.status='accepted'
          }
        })
        const myNew = await firestore.collection('users').doc(myId).update(myWorking)

        const theirProf = await firestore.collection('users').doc(theirId).get()
        const theirWorking = theirProf.data()
        theirWorking.associatedUsers.forEach(el => {
          if (el.userRef===myId) {
            el.status='accepted'
          }
        })
        const theirNew = await firestore.collection('users').doc(theirId).update(theirWorking)

        const myUpdated = await firestore.collection('users').doc(myId).get()
        dispatch(getContacts(myUpdated.data().associatedUsers))
      }
      if (status==='denied') {
        //denied to pending on mine
        const myProf = await firestore.collection('users').doc(myId).get()
        const myWorking = myProf.data()
        myWorking.associatedUsers.forEach(el => {
          if (el.userRef===theirId) {
            el.status='pending'
          }
        })
        const myNew = await firestore.collection('users').doc(myId).update(myWorking)
        //wasdenied to requested on theirs
        const theirProf = await firestore.collection('users').doc(theirId).get()
        const theirWorking = theirProf.data()
        theirWorking.associatedUsers.forEach(el => {
          if (el.userRef===myId) {
            el.status='requested'
          }
        })
        const theirNew = await firestore.collection('users').doc(theirId).update(theirWorking)
        dispatch(getContacts(myNew.data().associatedUsers))
      }
      else {
        //sening request for first time
        const myNew = await firestore.collection('users').doc(myId).update({associatedUsers: firebase.firestore.FieldValue.arrayUnion({userRef: theirId, canTrack: false, status: 'pending'})})
        const theirNew = await firestore.collection('users').doc(theirId).update({associatedUsers: firebase.firestore.FieldValue.arrayUnion({userRef: myId, canTrack: false, status: "requested"})})
        console.log(myNew.data().associatedUsers, theirNew.data().associatedUsers)
        dispatch(getContacts(myNew.data().associatedUsers))
      }
    } catch(e){alert(e)}
  }
}

export const removeContact = (myId, theirId) => {
  return async dispatch => {
    try {
      const myRef = await firestore.collection('users').doc(myId).get()
      const theirObj = myRef.data().associatedUsers.filter(el => {
        if (el.userRef===theirId) return el
      })[0]
      const myNew = await firestore.collection('users').doc(myId).update({associatedUsers: firebase.firestore.FieldValue.arrayRemove(theirObj)})
      theirObj.associatedUsers.map(el => {
        if (el.userRef===myId) {
          el.status = 'wasDenied'
        }
      })
      const myUpdated = await firestore.collection('users').doc(myId).get()
      dispatch(getContacts(myUpdated.data().associatedUsers))
    }catch(e){console.log(e)}
  }
}

export const changeConsent = (myId, theirId, value) => {
  return async dispatch => {
    try {
      const myRef = await firestore.collection('users').doc(myId).get()
      const myProf = myRef.data()
      myProf.associatedUsers.forEach(el => {
        if (el.userRef===theirId) {
          el.canTrack = value
        }
      })
      const myNew = await firestore.collection('users').doc(myId).update(myProf)
      const myUpdated = await firestore.collection('users').doc(myId).get()
      dispatch(getContacts(myUpdated.data().associatedUsers))
    }catch(e){alert(e)}
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
      filtered.map(async el => {
        let allUsers = []
        const contacts = Promise.all(el.usersInGroup.map( el => {
          const user = firestore.collection('users').doc(el).get()
          return user
        }))
        ;(await contacts).forEach(el => allUsers.push(el.data()))
        const finalContacts = allUsers.map((user, i) => {
          return {
            First: user.First,
            Last: user.Last,
            email: user.email,
            imgURL: user.imgURL,
            uid: user.uid
          }
        })
        el.usersInGroup = finalContacts
      })
      dispatch({type: GET_GROUPS, payload: filtered})
    } catch(e) {alert(e)}
  }
}

// export const leaveGroup = (groupId, userId) => {
//   return async dispatch => {
//     try {
//       const updated = await firestore.collection('groups').doc(groupId).update({usersInGroup: firebase.firestore.FieldValue.arrayRemove(userId)})
//       dispatch(getGroups())
//     } catch(e){alert(e)}
//   }
// }


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

