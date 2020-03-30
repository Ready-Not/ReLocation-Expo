import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, ListItem } from 'react-native'
import { Dropdown } from 'react-native-material-dropdown';
import { connect } from 'react-redux'
import firebase from '../../config';
import {getTracksThunk, cancelTrackThunk, confirmTrackThunk, declineTrackThunk} from '../../store/tracks'


class AllTracks extends React.Component {

  constructor (props) {
    super (props);
  }

  componentDidMount() {
    this.props.getTracks();
  }

  render() {
    return (
         <View style={styles.container}>
          {this.props.tracks.map((track) => {
          return(
            <View>
              <Text key={track}>Track: {track}</Text>
              <Button title="View this track"
              onPress={() => this.props.navigation.navigate('SingleTrack')}
              />
          </View>)}
          )}
         </View>
          )
           }

}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'flex-start'
  }
})

const mapDispatchToProps = dispatch => ({
  getTracks: () => dispatch(getTracksThunk()),
  cancelTrack: () => dispatch(cancelTrackThunk()),
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
