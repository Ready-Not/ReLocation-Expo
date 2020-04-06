import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, TouchableOpacityBase, Alert, ActivityIndicator } from 'react-native'
import { Dropdown } from 'react-native-material-dropdown';
import { connect } from 'react-redux'
import firebase from '../../config';
import {getTrackeeTracksThunk, getTrackerTracksThunk, cancelTrackThunk, confirmTrackThunk, declineTrackThunk, getTrackee, getTrackers} from '../../store/tracks'
import {ListItem} from 'react-native-elements';


class AllTracks extends React.Component {

  constructor (props) {
    super (props);
  }


  needConfirmation(track) {
    if (track.confirm == 'pending') {
      return (
        <View>
          <Text style={styles.rightElement}
          onPress={() => this.props.confirmTrack(track.id)}>Confirm Track</Text>
          <Text style={styles.rightElement}
          onPress={() =>
            Alert.alert('Decline Track',
              'Are you sure you want to decline the track',
              [{
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
                },
                {
                text: 'Yes',
                onPress: (id) => this.props.declineTrack(track.id)
                },],{ cancelable: false }
            )}>Decline Track</Text>
        </View>
      )
    } else if (track.confirm == 'confirmed') {
      return (
        <Text style={styles.rightElement} onPress={() =>
          Alert.alert('Cancel Track',
            'Are you sure you want to delete the track',
            [{
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
              },
              {
              text: 'Yes',
              onPress: (id) => this.props.cancelTrack(track.id)
              },], {cancelable: false}
          )}>Cancel Track</Text>
      )}
  }

  componentDidMount() {
    this.props.getTrackeeTracks();
    this.props.getTrackerTracks();
  }

  render() {
    const {trackeeTracks, trackerTracks} = this.props
    if (!this.props.trackeeTracks || !this.props.trackerTracks) {
      return (<ActivityIndicator />)
    }
    return (
      <View>
        {trackeeTracks.length ? <Text style={styles.title}>My Current Trips:</Text> : <></>}
        {trackeeTracks ? trackeeTracks.map(track => {
          let date = track.ETA.toDate().toLocaleString().split(' ')[0]
          let timeNum = track.ETA.toDate().toLocaleString().split(' ')[1].split(':').slice(0,2).join(':')
          let timeM = track.ETA.toDate().toLocaleString().split(' ')[2].toLowerCase()
          return(
            <ListItem
            key={track.id}
            title={`ETA: ${date} ${timeNum} ${timeM}`}
            subtitle={`Status: ${track.confirm}`}
            rightElement={this.needConfirmation(track)}
            bottomDivider
            onPress={() => (
              this.props.getTrackee(track.trackee),
              this.props.navigation.navigate('Trip', {track})
              )}
            />
          )
            }) : <></>}
          {trackerTracks.length ? <Text style={styles.title}>Trips I'm Monitoring:</Text> : <></>}
          {trackerTracks ? trackerTracks.map(track => {
            let date = track.ETA.toDate().toLocaleString().split(' ')[0]
            let timeNum = track.ETA.toDate().toLocaleString().split(' ')[1].split(':').slice(0,2).join(':')
          let timeM = track.ETA.toDate().toLocaleString().split(' ')[2].toLowerCase()
          return(
              <ListItem
              key={track.id}
              title={`ETA: ${date} ${timeNum} ${timeM}`}
              subtitle={`Status: ${track.confirm}`}
              rightElement={this.needConfirmation(track)}
              bottomDivider
              onPress={() => (
                this.props.getTrackee(track.trackee),
                this.props.navigation.navigate('Trip', {track})
                )} />
              )
            }) : <></>}
  </View>)
  }
}

const styles = StyleSheet.create({
  singleTrackBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.3)',
    padding: 5,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
    margin: 3,
    padding: 3,
},
buttonContainer: {
  flex: 1,
  flexDirection: 'row',
  backgroundColor: '#fff',
  alignItems: 'center',
  justifyContent: 'space-around',
  paddingLeft: 3,
  marginBottom: 3,
},
title: {
  margin: 7,
  padding: 7,
  fontSize: 24,
  textAlign: 'center',
  color: '#4faadb',
  fontWeight: 'bold',
},
textBox: {
    width: '75%',
    fontSize: 16,
    marginLeft: 5,
    textAlign: 'left',
},
button: {
    marginTop: 10,
    marginBottom: 10,
    paddingVertical: 5,
    alignItems: 'center',
    backgroundColor: '#4faadb',
    borderColor: '#4faadb',
    borderWidth: 1,
    borderRadius: 5,
    width: 160
},
buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff'
},
rightElement: {
  fontSize: 18,
  color: '#4faadb',
  fontStyle: 'italic',
  marginVertical: 5,
},
})

const mapDispatchToProps = dispatch => ({
  getTrackeeTracks: () => dispatch(getTrackeeTracksThunk()),
  getTrackerTracks: () => dispatch(getTrackerTracksThunk()),
  cancelTrack: (id) => dispatch(cancelTrackThunk(id)),
  confirmTrack: (id) => dispatch(confirmTrackThunk(id)),
  declineTrack: (id) => dispatch(declineTrackThunk(id)),
  getTrackee: (id) => dispatch(getTrackee(id)),
  getTrackers:(id) => dispatch(getTrackers(id))
})

const mapStateToProps = (state) => {
  return {
    user: state.user,
    trackeeTracks: state.tracks.trackeeTracks,
    trackerTracks: state.tracks.trackerTracks,
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(AllTracks)
