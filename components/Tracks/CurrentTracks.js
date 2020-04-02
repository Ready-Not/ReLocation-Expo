import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, ListItem, TouchableOpacityBase, Alert, ActivityIndicator } from 'react-native'
import { Dropdown } from 'react-native-material-dropdown';
import { connect } from 'react-redux'
import firebase from '../../config';
import {getTrackeeTracksThunk, getTrackerTracksThunk, cancelTrackThunk, confirmTrackThunk, declineTrackThunk} from '../../store/tracks'


class AllTracks extends React.Component {

  constructor (props) {
    super (props);
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

  componentDidMount() {
    this.props.getTrackeeTracks();
    this.props.getTrackerTracks();
  }

  render() {
    if (!this.props.trackeeTracks || !this.props.trackerTracks) {
      return (
        <ActivityIndicator />
      )
    }

    return (
      <View style={styles.container}>
          <Text>WHO IS TRACKING ME:</Text>
          {
          this.props.trackeeTracks.map((track) => {
          return(
            <View key={track.id} style={styles.singleTrackBox}>

              <TouchableOpacity

                onPress={() => this.props.navigation.navigate('Trip', {track})}>

                <Text>Track with ETA: {track.ETA.toDate().toLocaleString()}</Text>
                <Text>Track status: {track.confirm}</Text>
              </TouchableOpacity>
              {this.needConfirmation(track)}
           </View>
          )}
          )}

        <View style={styles.container}>
        <Text>I AM TRACKING:</Text>
        {
        this.props.trackerTracks.map((track) => {

        return(

          <View key={track.id} style={styles.singleTrackBox}>
           <TouchableOpacity

              onPress={() => this.props.navigation.navigate('Trip', {track})}>

             <Text>Track with ETA: {track.ETA.toDate().toLocaleString()}</Text>
             <Text>Track status: {track.confirm}</Text>
            </TouchableOpacity>
          </View>



         )}
         )}
        </View>

  </View>)
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
  getTrackeeTracks: () => dispatch(getTrackeeTracksThunk()),
  getTrackerTracks: () => dispatch(getTrackerTracksThunk()),
  cancelTrack: (id) => dispatch(cancelTrackThunk(id)),
  confirmTrack: (id) => dispatch(confirmTrackThunk(id)),
  declineTrack: (id) => dispatch(declineTrackThunk(id))
})

const mapStateToProps = (state) => {
  return {
    user: state.user,
    trackeeTracks: state.tracks.trackeeTracks,
    trackerTracks: state.tracks.trackerTracks,
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(AllTracks)
