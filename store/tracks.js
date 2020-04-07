import firebase, {firestore} from '../config'
import { concat } from 'react-native-reanimated'

const GET_TRACKEE_TRACKS = 'GET_TRACKEE_TRACKS'
const GET_TRACKER_TRACKS = 'GET_TRACKER_TRACKS'
const CANCEL_TRACK = 'CANCEL_TRACK'
const CONFIRM_TRACK = 'CONFIRM_TRACK'
const DECLINE_TRACK = 'DECLINE_TRACK'
const SET_TRACK = 'SET_TRACK'
const GOT_TRACKEE = 'GET_TRACKEE'
const GOT_TRACKER = 'GET_TRACKER'


//TRACKS ACTIONS

const gotTrackee = trackee => ({
  type: GOT_TRACKEE,
  trackee
})

const gotTracker = tracker => ({
  type: GOT_TRACKER,
  tracker
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

const setTrack = track => ({
  type: SET_TRACK,
  track
})

//TRACKS THUNKS

export const getTrackee = uid => {
  return async (dispatch, getState) => {
      try {
          const user = await firestore
              .collection('users')
              .doc(uid)
              .get()
          const names = {first: user.data().First, last: user.data().Last, imgURL: user.data().imgURL}
          dispatch(gotTrackee(names))
      } catch (e) {
          alert(e)
      }
  }
}

export const getTracker = uid => {
  return async (dispatch, getState) => {
      try {
          const user = await firestore
              .collection('users')
              .doc(uid)
              .get()
          let tr = user.data().First + ' ' + user.data().Last
          dispatch(gotTracker(tr))
      } catch (e) {
          alert(e)
      }
  }
}

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
          trackers: trackData.trackers,
          destination: trackData.finalLocation,
          place: trackData.destination,
          ETA: trackData.ETA,
          confirm: trackData.confirm,
        }
        allMyTracks.push(currentTrack)
      })
      dispatch({type: GET_TRACKEE_TRACKS, payload: allMyTracks})
    } catch (error){
       console.log('Failed to get users tracks', error)
    }
  }
}

export const getTrackerTracksThunk = () => {
  return async (dispatch) => {
     try {
      const currentUser = await firebase.auth().currentUser
      let allMyTracks = []
      const allTracks = await firestore
              .collection('tracks')
              .where('trackers', 'array-contains', currentUser.uid)
              .where('status', '==', 'open')
              .get()
      allTracks.forEach((track) => {
        let trackData = track.data()
        let currentTrack = {
          id: track.id,
          trackee: trackData.trackee,
          trackers: trackData.trackers,
          destination: trackData.finalLocation,
          place: trackData.destination,
          ETA: trackData.ETA,
          confirm: trackData.confirm,
        }
        allMyTracks.push(currentTrack)
      })
      dispatch({type: GET_TRACKER_TRACKS, payload: allMyTracks})
    } catch (error){
      console.log('Failed to get users tracks', error)
    }
  }
}

export const cancelTrackThunk = (id, status) => {
  return async (dispatch) => {
    try {
      await firestore
              .collection('tracks')
              .doc(id)
              .delete()
      dispatch({type: CANCEL_TRACK, payload: id, status})
    }
    catch (error) {
      console.log('Failed to cancel track instance', error)
    }
  }
}

export const confirmTrackThunk = (id, status) => {
  return async (dispatch) => {
    try {
      await firestore
              .collection('tracks')
              .doc(id)
              .update({
                confirm: 'confirmed'
              })
      dispatch({type: CONFIRM_TRACK, payload: id, status})
    }
    catch (error) {
      console.log('Failed to confirm track instance', error)
    }
  }
}

export const declineTrackThunk = (id, status) => {
  return async (dispatch) => {
    try {
      await firestore
              .collection('tracks')
              .doc(id)
              .update({
                confirm: 'declined'
              })
      dispatch({type: DECLINE_TRACK, payload: id, status})
    }
    catch (error) {
      console.log('Failed to declined track instance', error)
    }
  }
}

export const setTrackThunk = (newTrack) => {
  return async (dispatch, getState) => {
    try {
      let confirm = 'pending'
      const currentUser = await firebase.auth().currentUser
      if(currentUser.uid === newTrack.trackee) confirm = 'confirmed'

      const track = {
        trackee: newTrack.trackee,
        trackers: newTrack.trackers,
        ETA: newTrack.ETA,
        currentLocation: newTrack.currentLocation,
        finalLocation: newTrack.finalLocation,
        destination: newTrack.targetAddress,
        confirm,
        status: 'open'
      }
      await firestore.collection('tracks')
                .add(track)
    } catch (e) {
      console.log(e)
    }
  }
}

const initialState = {}

// TRACKS REDUCER

const tracksReducer = (state = initialState, action) => {
  switch (action.type) {
    case GOT_TRACKEE:
      return {...state, trackee: action.trackee}
    case GOT_TRACKER:
      return {...state, trackers: [...action.tracker]}
    case GET_TRACKEE_TRACKS:
      return {...state, trackeeTracks: action.payload}
      case GET_TRACKER_TRACKS:
        return {...state, trackerTracks: action.payload}
    case CANCEL_TRACK:
      if(action.status === 'trackee'){
        return (
          {...state,
            trackeeTracks: state.trackeeTracks.filter(
              track => track.id !== action.payload)})
      }else{
        return (
          {...state,
            trackerTracks: state.trackerTracks.filter(
              track => track.id !== action.payload)})
      }
    case CONFIRM_TRACK:
      let newTrackerTracks = state.trackerTracks.map(track => {
        if (track.id == action.payload) {
          track.confirm = 'confirmed'
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
      newTrackerTracks = state.trackerTracks.map(track => {
        if (track.id == action.payload) {
          track.confirm = 'declined'
        }
        return track
      });
      return (
        {
          ...state,
          trackerTracks: newTrackerTracks
        }
      )
    case SET_TRACK:
      return (
          {...state, trackeeTracks: [...state.trackeeTracks, action.track]}
        )
    default:
      return state
  }
}

export default tracksReducer
