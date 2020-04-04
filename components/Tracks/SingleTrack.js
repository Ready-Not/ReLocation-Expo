import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, TextComponent, Button} from 'react-native';
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
      trackers: [],
      eta: 'a time'
    }
  }

  componentDidMount(){
    const {track} = this.props.route.params
    this.props.getTrackee(track.trackee)
    this.attemptReverseGeocodeAsync()
    track.trackers.map(tracker => this.getTrackerName(tracker))
    this.getETA(track)
  }

  needConfirmation(track) {
    if (track.confirm == 'pending') {
      return (
        <View>
        <Button
        title='Confirm track'
        onPress={() => this.props.confirmTrack(track.id)}
        >
        </Button>
        <Button
        title='Decline track'
        // onPress={() => this.props.declineTrack(track.id)}
        onPress={() =>
          Alert.alert(
            'Decline Track',
            'Are you sure you want to decline the track',
            [
              {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
              },
              {
              text: 'Yes',
              onPress: (id) => this.props.declineTrack(track.id)
              },
            ],
            { cancelable: false }
          )}
        >
        </Button>
        </View>
      )
    } else if (track.confirm == 'confirmed') {
      return (
        <Button title="Cancel track"
                onPress={() =>
                  Alert.alert(
                    'Cancel Track',
                    'Are you sure you want to delete the track',
                    [
                      {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                      },
                      {
                      text: 'Yes',
                      onPress: (id) => this.props.cancelTrack(track.id)
                      },
                    ],
                    { cancelable: false }
                  )}
              />
      )
    }
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

    getETA(track) {
      let eta = track.ETA.toDate().toLocaleString().split(',')
      eta = eta[0] + ' at ' + eta[1]
      this.setState({ eta })
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

        <Text>
        {
          this.state.trackers.map(tracker => <Text key={tracker}> {tracker}, </Text>)
        }
        are checking to make sure {this.props.trackee.first} gets to {this.state.destination} safely by {this.state.eta}
        </Text>

    <Image
    style={{height: 100, width: 100}}
    source={{uri: "https://snazzymaps.com/Images/img-style-preview-default.png"}}
    ></Image>

       {this.needConfirmation(track)}

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

