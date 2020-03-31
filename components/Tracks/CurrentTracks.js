import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, ListItem, TouchableOpacityBase, Alert } from 'react-native'
import { Dropdown } from 'react-native-material-dropdown';
import { connect } from 'react-redux'
import firebase from '../../config';
import {getTrackeeTracksThunk, getTrackerTracksThunk, cancelTrackThunk, confirmTrackThunk, declineTrackThunk} from '../../store/tracks'


class AllTracks extends React.Component {

  constructor (props) {
    super (props);
  }


  needConfirmation(track) {
    console.log('track from needConfirmation', track)
    if (track.confirm == 'pending') {
      return (
        <Button
        title='Confirm track'
        onPress={() => this.props.confirmTrack(track.id)}
        >
        </Button>
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
        <Text>Loading...</Text>
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
                onPress={() => this.props.navigation.navigate('SingleTrack')}>
                <Text>Track with ETA: {track.ETA.toDate().toLocaleString()}</Text>
              </TouchableOpacity>

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
              onPress={() => this.props.navigation.navigate('SingleTrack')}>
             <Text>Track with ETA: {track.ETA.toDate().toLocaleString()}</Text>
             <Text>Track status: {track.confirm}</Text>
            </TouchableOpacity>
            {this.needConfirmation(track)}
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
      alignItems: 'center',
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
  declineTrack: () => dispatch(declineTrackThunk())
})

const mapStateToProps = (state) => {
  return {
    user: state.user,
    trackeeTracks: state.tracks.trackeeTracks,
    trackerTracks: state.tracks.trackerTracks,
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(AllTracks)
