import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, TouchableOpacityBase, Alert, ActivityIndicator } from 'react-native'
import { Dropdown } from 'react-native-material-dropdown';
import { connect } from 'react-redux'
import firebase from '../../config';
import {getTrackeeTracksThunk, getTrackerTracksThunk, cancelTrackThunk, confirmTrackThunk, declineTrackThunk, getTrackee, getTrackers} from '../../store/tracks'
import {ListItem} from 'react-native-elements';
import * as Location from 'expo-location';
import { greaterThan } from 'react-native-reanimated';


class AllTracks extends React.Component {

  constructor (props) {
    super (props);
  }


  needConfirmation(track, status) {
    if (track.confirm == 'pending') {
      return (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
          <Text style={styles.rightElement}
          onPress={() => this.props.confirmTrack(track.id, status)}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
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
                onPress: (id) => this.props.declineTrack(track.id, status)
                },],{ cancelable: false }
            )}>Decline</Text>
            </TouchableOpacity>
        </View>
      )
    } else if (track.confirm == 'confirmed' && status === 'trackee') {
      return (
        <TouchableOpacity style={styles.button}>
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
              onPress: (id) => this.props.cancelTrack(track.id, status)
              },], {cancelable: false}
          )}>Cancel</Text>
          </TouchableOpacity>
      )}
  }

  getETA(eta){
    let date = eta.toDate().toLocaleString().split(' ')[0]
    let timeNum = eta.toDate().toLocaleString().split(' ')[1].split(':').slice(0,2).join(':')
    let timeM = eta.toDate().toLocaleString().split(' ')[2].toLowerCase()
    return `${date}`
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
        <Text style={styles.title}>My Current Trips:</Text>
        {(trackeeTracks.length >= 1) ? trackeeTracks.map(track => {
          let eta = this.getETA(track.ETA)
          return(
            <ListItem
            key={track.id}
            title={`${track.place} on ${eta}`}
            titleStyle={styles.trackBox}
            subtitle={
              <View style={styles.subtitleView}>
                {track.confirm === 'confirmed' ? <Text style={styles.confirmedText}>{track.confirm}</Text> : <></>}
                {track.confirm === 'pending' ? <Text style={styles.pendingText}>{track.confirm}</Text> : <></>}
                {track.confirm === 'declined' ? <Text style={styles.declinedText}>{track.confirm}</Text> : <></>}
              </View>
            }
            rightElement={this.needConfirmation(track, 'trackee')}
            bottomDivider
            onPress={() => (
              this.props.getTrackee(track.trackee),
              this.props.navigation.navigate('Trip', {track})
              )}
            />
          )
            }) : <Text style={styles.notice}>You don't have any trips planned right now</Text>}

          <Text style={styles.title}>My Friends' Trips:</Text>
          {(trackerTracks.length >= 1) ? trackerTracks.map(track => {
            let eta = this.getETA(track.ETA)
          return(
              <ListItem
              key={track.id}
              title={`${track.place} on ${eta}`}
              titleStyle={styles.trackBox}
              subtitle={
                <View style={styles.subtitleView}>
                  {track.confirm === 'confirmed' ? <Text style={styles.confirmedText}>{track.confirm}</Text> : <></>}
                  {track.confirm === 'pending' ? <Text style={styles.pendingText}>{track.confirm}</Text> : <></>}
                  {track.confirm === 'declined' ? <Text style={styles.declinedText}>{track.confirm}</Text> : <></>}
                </View>
              }
              rightElement={this.needConfirmation(track, 'tracker')}
              bottomDivider
              onPress={() => (
                this.props.getTrackee(track.trackee),
                this.props.navigation.navigate('Trip', {track})
                )} />
              )
            }) : <Text style={styles.notice}>You aren't checking on any of your friends' trips right now</Text>}
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
  flexDirection: 'column',
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
    textAlign: 'center',
},
button: {
    marginTop: 8,
    marginBottom: 8,
    paddingVertical: 3,
    alignItems: 'center',
    backgroundColor: '#4faadb',
    borderColor: '#4faadb',
    borderWidth: 1,
    borderRadius: 5,
    width: 100
},
buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff'
},
rightElement: {
  color: 'white',
  marginVertical: 5,
},
notice: {
  textAlign:'center',
  fontSize: 10,
},
confirmedText:{
  fontSize: 12,
  color: 'green',
  margin: 5,
},
pendingText:{
  fontSize: 12,
  color: 'orange',
  margin: 5,
},
declinedText:{
  fontSize: 12,
  color: 'grey',
  margin: 5,
},
trackBox:{
  fontSize: 13,
}
})

const mapDispatchToProps = dispatch => ({
  getTrackeeTracks: () => dispatch(getTrackeeTracksThunk()),
  getTrackerTracks: () => dispatch(getTrackerTracksThunk()),
  cancelTrack: (id, status) => dispatch(cancelTrackThunk(id, status)),
  confirmTrack: (id, status) => dispatch(confirmTrackThunk(id, status)),
  declineTrack: (id, status) => dispatch(declineTrackThunk(id, status)),
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
