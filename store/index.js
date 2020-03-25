import { combineReducers } from 'redux'
import { LOGIN, SIGNUP, UPDATE_EMAIL, UPDATE_PASSWORD } from './user'

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
    default:
      return state
  }
}

const rootReducer = combineReducers({
  user
})

export default rootReducer
