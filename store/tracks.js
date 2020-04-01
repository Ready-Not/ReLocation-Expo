import firebase, {firestore} from '../config'

const GET_TRACKEE_TRACKS = 'GET_TRACKEE_TRACKS'
const GET_TRACKER_TRACKS = 'GET_TRACKER_TRACKS'
const CANCEL_TRACK = 'CANCEL_TRACK'
const CONFIRM_TRACK = 'CONFIRM_TRACK'
const DECLINE_TRACK = 'DECLINE_TRACK'
const SET_TRACK = 'SET_TRACK'


//TRACKS ACTIONS

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

const setTrack = track => ({
  type: SET_TRACK,
  track
})

//TRACKS THUNKS

export const getTrackeeTracksThunk = () => {
  return async (dispatch) => {
     try {
      const currentUser = await firebase.auth().currentUser
      let allMyTracks = []
      const allTracks = await firestore
              .collection('tracks')
              .where('trackee', '==', currentUser.uid)
              .where('status', '==', 'open')
              .get()
      allTracks.forEach(track => {
        let trackData = track.data()
        let currentTrack = {
          id: track.id,
          trackee: trackData.trackee,
          ETA: trackData.ETA,
          confirm: trackData.confirm,
        }
        allMyTracks.push(currentTrack)
      })
      console.log('payload sent from get trackee reducer thunk', allMyTracks)
      dispatch({type: GET_TRACKEE_TRACKS, payload: allMyTracks})
    } catch (error){
      // console.log('Failed to get users tracks', error)
    }
  }
}

export const getTrackerTracksThunk = () => {
  return async (dispatch) => {
     try {
       console.log('hitting get tracker tracks thunk')
      const currentUser = await firebase.auth().currentUser
      let allMyTracks = []
      const allTracks = await firestore
              .collection('tracks')
              .where('tracker', 'array-contains', currentUser.uid)
              .where('status', '==', 'open')
              .get()
      allTracks.forEach(track => {
        let trackData = track.data()
        let currentTrack = {
          id: track.id,
          trackee: trackData.trackee,
          ETA: trackData.ETA,
          confirm: trackData.confirm,
        }
        allMyTracks.push(currentTrack)
      })
      console.log('payload sent from get tracker reducer thunk', allMyTracks)
      dispatch({type: GET_TRACKER_TRACKS, payload: allMyTracks})
    } catch (error){
      console.log('Failed to get users tracks', error)
    }
  }
}

export const cancelTrackThunk = (id) => {
  return async (dispatch) => {
    try {
      await firestore
              .collection('tracks')
              .doc(id)
              .delete()
      dispatch({type: CANCEL_TRACK, payload: id})
    }
    catch (error) {
      console.log('Failed to cancel track instance', error)
    }
  }
}

export const confirmTrackThunk = (id) => {
  console.log('track id from confirm thunk', id)
  return async (dispatch) => {
    try {
      await firestore
              .collection('tracks')
              .doc(id)
              .update({
                confirm: 'approved'
              })
      dispatch({type: CONFIRM_TRACK, payload: id})
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

export const setTrackThunk = (newTrack) => {
  return async (dispatch, getState) => {
    try {
      console.log(newTrack.currentLocation);
      console.log(newTrack.finalLocation);
      const currentUser = await firebase.auth().currentUser
      const track = {
        trackee: currentUser.uid,
        ETA: newTrack.ETA,
        currentLocation: newTrack.currentLocation,
        finalLocation: newTrack.finalLocation,
        confirm: 'pending',
        status: 'open'
      }
      firestore.collection('tracks')
                .add(track)
      // console.log('payload sent from set_track thunk', track)
      dispatch({ type: SET_TRACK, payload: track })
    } catch (e) {
      console.log(e)
    }
  }
}

const initialState = {}

// TRACKS REDUCER

const tracksReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TRACKEE_TRACKS:
      return {...state, trackeeTracks: action.payload}
      case GET_TRACKER_TRACKS:
        return {...state, trackerTracks: action.payload}
    case CANCEL_TRACK:
      return (
        {
          ...state,
          trackeeTracks: state.trackeeTracks.filter(
            track => track.id !== action.payload
          )
        }
      )
    case CONFIRM_TRACK:
      const newTrackerTracks = state.trackerTracks.map(track => {
        if (track.id == action.payload) {
          track.confirm = 'approved'
        }
        return track
      });
      return (
        {
          ...state,
          trackerTracks: newTrackerTracks
        }
      )
    case DECLINE_TRACK:
      return (
        //map through state.tracks and find instance with ID===action.trackId. Set canTrack status to false?
        // return new tracks array
        true
      )
      case SET_TRACK:
      // console.log('action payload received to set track reducer', action.payload)
      return (
          {...state, trackeeTracks: [...state.trackeeTracks, action.payload]}
        )
    default:
      return state
  }
}

export default tracksReducer
