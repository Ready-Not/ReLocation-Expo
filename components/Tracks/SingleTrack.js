import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator} from 'react-native';
import { connect } from 'react-redux'
import {Actions} from 'react-native-router-flux';
import {getTracksThunk, cancelTrackThunk, confirmTrackThunk, declineTrackThunk, getTrackee, getTrackers} from '../../store/tracks'


class SingleTrack extends Component {
  constructor() {
    super()
    this.state={}
    this.endTrack=this.endTrack.bind(this)
  }

  componentDidMount(){
    this.props.getTrackee(this.props.route.params.track.trackee)
    this.props.getTrackers(this.props.route.params.track.trackers)
  }

  endTrack () {
    //figure out a way to stop this track, notify tracker and trackee and either remove from database or set database status to complete: true and send them back to an updated Current Tracks screen
  }

  render() {
    const {track} = this.props.route.params
    if(!this.props.trackee){
      return (
        <View>
          <ActivityIndicator style={{ marginTop: 10 }} />
        </View>
      )
    }
    else {
    return (
      <View>
        <Text
          style={{textAlign: "center", fontSize: 18}}>
          {this.props.trackee.first}'s Trip Details
        </Text>
      </View>
    )
   }
 }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'flex-start',
      justifyContent: 'flex-start'
  },
  singleTrackBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.3)',
    padding: 10,
  },
})

const mapDispatchToProps = dispatch => ({
  getTracks: () => dispatch(getTracksThunk()),
  cancelTrack: () => dispatch(cancelTrackThunk()),
  confirmTrack: () => dispatch(confirmTrackThunk()),
  declineTrack: () => dispatch(declineTrackThunk()),
  getTrackee: (uid) => dispatch(getTrackee(uid)),
  getTrackers: (uids) => dispatch(getTrackers(uids))
})

const mapStateToProps = (state) => {
  return {
    user: state.user,
    trackee: state.tracks.trackee,
    trackers: state.tracks.trackers
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleTrack)

