import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button } from 'react-native'
import { Dropdown } from 'react-native-material-dropdown';
import { connect } from 'react-redux'
import firebase from '../../config';


class AllTracks extends React.Component {

  constructor (props) {
    super (props);
  }


  render() {

    return (
       <View style={styles.container}>
         <Text>A List of your current/active tracks</Text>
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

export default AllTracks
