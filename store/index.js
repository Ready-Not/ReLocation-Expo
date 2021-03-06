import { combineReducers } from 'redux'
import { LOGIN, SIGNUP, UPDATE_EMAIL, UPDATE_PASSWORD, GET_CONTACTS, GET_GROUPS, SEARCH, CREATE_GROUP, LEAVE_GROUP, ADD_CONTACT, } from './user'
import { ActionConst } from 'react-native-router-flux'
import tracksReducer from './tracks'


const user = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_EMAIL:
      return { ...state, email: action.payload }
    case UPDATE_PASSWORD:
      return { ...state, password: action.payload }
    case LOGIN:
      return action.payload
    case SIGNUP:
      return action.payload
    case GET_CONTACTS:
      return {...state, contacts: action.payload}
    case GET_GROUPS:
      return {...state, groups: action.payload}
    case SEARCH:
      return {...state, found: action.payload}
    default:
      return state
  }
}

const rootReducer = combineReducers({
  user,
  tracks: tracksReducer,
})

export default rootReducer
