import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, ListItem, TouchableOpacityBase, Alert } from 'react-native'
import { Dropdown } from 'react-native-material-dropdown';
import { connect } from 'react-redux'
import firebase from '../../config';
import {getTrackeeTracksThunk, cancelTrackThunk, confirmTrackThunk, declineTrackThunk} from '../../store/tracks'


class AllTracks extends React.Component {

  constructor (props) {
    super (props);
  }

  componentDidMount() {
    this.props.getTrackeeTracks();
  }

  render() {
    if (!this.props.tracks.trackeeTracks) {
      return (
        <Text>Loading...</Text>
      )
    }

    return (
         <View style={styles.container}>
          {
          this.props.tracks.trackeeTracks.map((track) => {
          return(
            <View style={styles.singleTrackBox}>
            <TouchableOpacity
            onPress={() => this.props.navigation.navigate('SingleTrack')}>
              <Text>Track with ETA: {track.ETA.toDate().toLocaleString()}</Text>
          </TouchableOpacity>
          <Button title="Cancel track"
          onPress={() => Alert.alert(
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
         </View>
    // <Text>{JSON.stringify(this.props.tracks.trackeeTracks)}</Text>
          )
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
  cancelTrack: (id) => dispatch(cancelTrackThunk(id)),
  confirmTrack: () => dispatch(confirmTrackThunk()),
  declineTrack: () => dispatch(declineTrackThunk())
})

const mapStateToProps = (state) => {
  return {
    user: state.user,
    tracks: state.tracks
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(AllTracks)
