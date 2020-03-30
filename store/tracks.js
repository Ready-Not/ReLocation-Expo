import firebase, {firestore} from '../config'

const GET_TRACKS = 'GET_TRACKS'
const CANCEL_TRACK = 'CANCEL_TRACK'
const CONFIRM_TRACK = 'CONFIRM_TRACK'
const DECLINE_TRACK = 'DECLINE_TRACK'


//TRACKS ACTIONS

const getTracks = tracks => ({
  type: GET_TRACKS,
  tracks
})

const cancelTrack = trackId => ({
  type: CANCEL_TRACK,
  trackId
})

const confirmTrack = trackId => ({
  type: CONFIRM_TRACK,
  trackId
})

const declineTrack = trackId => ({
  type: DECLINE_TRACK,
  trackId
})

//TRACKS THUNKS

export const getTracksThunk = () => {
  return async (dispatch) => {
     try {
      const data = ['a', 'b', 'c'];
      //find all tracks where uid  === trackee
      // find all tracks where uid is in the tracker array
      //combine the two results into a single array
      const allTracks = await firestore
              .collection('tracks')
              .get()

      console.log(allTracks)
      dispatch(getTracks(data))
    } catch (error){
      console.log('Failed to get users tracks', error)
    }
  }
}

export const cancelTrackThunk = (id) => {
  return async (dispatch) => {
    try {
      // find track where doc.id === id and delete the doc
      // dispatch ID only, remove from this users' array in reducer
      dispatch(cancelTrack(trackId))
    }
    catch (error) {
      console.log('Failed to cancel track instance', error)
    }
  }
}

export const confirmTrackThunk = (id) => {
  return async (dispatch) => {
    try {
      // find track where doc.id === id
      // update doc to track confirmed to true
      dispatch(cancelTrack(trackId))
    }
    catch (error) {
      console.log('Failed to confirm track instance', error)
    }
  }
}

export const declineTrackThunk = (id) => {
  return async (dispatch) => {
    try {
      // find track where doc.id === id
      // update doc to track confirmed to false
      // delete instance? for this user?
      dispatch(declineTrack(trackId))
    }
    catch (error) {
      console.log('Failed to declined track instance', error)
    }
  }
}


const initialState = []

// TRACKS REDUCER

const tracksReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TRACKS:
      return action.tracks
    case CANCEL_TRACK:
      return (
        //map through state.tracks and remove track w/ ID===action.trackId
        //return new tracks array
        true
      )
    case CONFIRM_TRACK:
      return (
        //map through state.tracks and find instance with ID===action.trackId. Set canTrack status to true
        // return new tracks array
        true
      )
    case DECLINE_TRACK:
      return (
        //map through state.tracks and find instance with ID===action.trackId. Set canTrack status to false?
        // return new tracks array
        true
      )
    default:
      return state
  }
}

export default tracksReducer
