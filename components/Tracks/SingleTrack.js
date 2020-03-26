import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Actions} from 'react-native-router-flux';

class SingleTrack extends Component {
  constructor() {
    super()
    this.state={}
    this.endTrack=this.endTrack.bind(this)
  }

  endTrack () {
    //figure out a way to stop this track, notify tracker and trackee and either remove from database or set database status to complete: true and send them back to an updated Current Tracks screen
  }

  render() {
    const {track} = this.props
    return (
      <View>
        <Text>Tracking {track.trackee.first} {track.trackee.last}</Text>
        <Text>Trackers:</Text>
        {track.trackers.map(tracker => {
          if (tracker.name) {
          return <Text>Group: {tracker.name}</Text>
          } else {return <Text>Contact: {tracker.first} {tracker.last}</Text>}
        })}
        <Text>Location: {track.location}</Text>
        <Text>Ends at: {track.time}</Text>
        })}
        <TouchableOpacity>
          <Text onPress={this.endTrack}>End Track</Text>
          </TouchableOpacity>
      </View>
    )
  }
}

export default SingleTrack
