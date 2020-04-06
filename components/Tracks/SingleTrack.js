import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, TextComponent, Button, Alert} from 'react-native';
import {Avatar} from 'react-native-elements'
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
      eta: 'a time',
      be: 'is'
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
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => (
          this.props.navigation.navigate('Trip', {track}),
          this.props.confirmTrack(track.id))}>
            <Text style={styles.buttonText}>Confirm Track</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() =>
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
              },],
            { cancelable: false }
          )}>
            <Text style={styles.buttonText}>Decline Track</Text>
          </TouchableOpacity>
        {/* <Button
        title='Confirm track'
        onPress={() => (
          this.props.navigation.navigate('Trip', {track}),
          this.props.confirmTrack(track.id))}
        >
        </Button> */}
        {/* <Button
        title='Decline track'
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
        </Button> */}
        </View>
      )
    } else if (track.confirm == 'confirmed') {
      return (
        <TouchableOpacity style={styles.button} onPress={() =>
          Alert.alert(
            'Cancel Track',
            'Are you sure you want to delete the track',
            [{
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
              },
              {
              text: 'Yes',
              onPress: (id) => this.props.cancelTrack(track.id)
              },],
            { cancelable: false }
          )}>
          <Text style={styles.buttonText}>Cancel Track</Text>
        </TouchableOpacity>
        // <Button title="Cancel track"
        //         onPress={() =>
        //           Alert.alert(
        //             'Cancel Track',
        //             'Are you sure you want to delete the track',
        //             [
        //               {
        //               text: 'Cancel',
        //               onPress: () => console.log('Cancel Pressed'),
        //               style: 'cancel',
        //               },
        //               {
        //               text: 'Yes',
        //               onPress: (id) => this.props.cancelTrack(track.id)
        //               },
        //             ],
        //             { cancelable: false }
        //           )}
        //       />
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
      if(trackers.length !== 1) this.setState({ be: 'are'})
    }

    getETA(track) {
      let eta = track.ETA.toDate().toLocaleString().split(',')
      eta = eta[0] + ' at ' + eta[1]
      this.setState({ eta })
    }

  render() {
    const {track} = this.props.route.params

    if(!this.props.trackee || !this.state.trackers || !this.state.destination){
      return (
        <View>
          <ActivityIndicator />
        </View>
      )
    }
    else {
    return (
      <View style={styles.container}>
        <Text
          style={styles.title}>
          {this.props.trackee.first}'s Trip Details
        </Text>
        <Avatar
          size="xlarge"
          rounded
          borderColor="#4faadb"
          borderWidth="5"
          source={{uri: this.props.trackee.imgURL}}
        />
        <Text style={styles.textBox}>
        {this.state.trackers.map(tracker => <Text key={tracker}> {tracker}, </Text>)}
        {this.state.be} checking to make sure {this.props.trackee.first} gets to {this.state.destination} safely on {this.state.eta}
        </Text>
        <MapView
        style={styles.map}
        initialRegion={{
        latitude: track.destination.latitude,
        longitude: track.destination.longitude,
        latitudeDelta: 0.008,
        longitudeDelta: 0.005
        }}
        >
        <MapView.Marker
          pinColor='#4faadb'
          coordinate={{
            latitude: track.destination.latitude,
            longitude: track.destination.longitude}}
          title={`${this.props.trackee.first}'s destination`}
        />
        </MapView>

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
  button: {
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    backgroundColor: '#4faadb',
    borderColor: '#4faadb',
    borderWidth: 1,
    borderRadius: 5,
    width: 150,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff'
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
},
  textBox: {
    width: '90%',
    margin: 5,
    padding: 5,
    fontSize: 20,
    textAlign: 'center',
  },
  title: {
    marginTop: 10,
    marginBottom: 10,
    paddingVertical: 5,
    alignItems: 'center',
    backgroundColor: '#4faadb',
    borderColor: '#4faadb',
    borderWidth: 1,
    borderRadius: 5,
    width: 300,
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: "center",
  },
  map: {
    height: 200,
    width: 200,
    margin: 20,
    borderWidth: 2,
    borderColor: '#4faadb'
  }
})

const mapDispatchToProps = dispatch => ({
  getTracks: () => dispatch(getTracksThunk()),
  cancelTrack: () => dispatch(cancelTrackThunk()),
  confirmTrack: (id) => dispatch(confirmTrackThunk(id)),
  declineTrack: (id) => dispatch(declineTrackThunk(id)),
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

