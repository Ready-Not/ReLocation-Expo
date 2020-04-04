import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, TextComponent} from 'react-native';
import { connect } from 'react-redux'
import {Actions} from 'react-native-router-flux';
import {getTracksThunk, cancelTrackThunk, confirmTrackThunk, declineTrackThunk, getTrackee, getTracker} from '../../store/tracks'
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import { conditionalExpression } from '@babel/types';
import firebase, {firestore} from '../../config'

class SingleTrack extends Component {
  constructor() {
    super()
    this.state={
      inProgress: false,
      error: null,
      destination: '',
      trackers: []
    }
  }

  componentDidMount(){
    const {track} = this.props.route.params
    this.props.getTrackee(track.trackee)
    this.attemptReverseGeocodeAsync()
    track.trackers.map(tracker => this.getTrackerName(tracker))
  }


  attemptReverseGeocodeAsync = async () => {
    this.setState({ inProgress: true });
    try {
    let result = await Location.reverseGeocodeAsync(
    this.props.route.params.track.destination
    );
    let destination = (result[0].name) + ', ' + (result[0].city) + ', ' + (result[0].region)
    this.setState({ destination });
    } catch (e) {
    this.setState({ error: e });
    } finally {
    this.setState({ inProgress: false });
    }
    };

    getTrackerName = async (uid) => {
      let trackers = this.state.trackers
      const user = await firestore
      .collection('users')
      .doc(uid)
      .get()
      let tr = user.data().First + ' ' + user.data().Last
      trackers.push(tr)
      this.setState({ trackers })
    }


  render() {
    const {track} = this.props.route.params

    if(!this.props.trackee || !this.state.trackers){
      return (
        <View>
          <ActivityIndicator />
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

        <Text> Friends
        {
          this.state.trackers.map(tracker => <Text key={tracker}> {tracker}, </Text>)
        }
        are checking to make sure {this.props.trackee.first} gets to {this.state.destination} safely
        </Text>

    <Image
    style={{height: 100, width: 100}}
    source={{uri: "https://snazzymaps.com/Images/img-style-preview-default.png"}}
    ></Image>
    <Text>{JSON.stringify(track)}</Text>
    {
      track.confirm ? <Text>Confirmed</Text> : <Text>Not yet confirmed</Text>
    }
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
  getTracker: (uids) => dispatch(getTracker(uids))
})

const mapStateToProps = (state) => {
  return {
    user: state.user,
    trackee: state.tracks.trackee,
    trackers: state.tracks.trackers
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleTrack)

