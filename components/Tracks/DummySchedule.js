import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, Alert, Dimensions, ActivityIndicator, FlatList, TouchableHighlight, Platform, ScrollView, TouchableOpacityBase, Switch } from 'react-native'
import { Dropdown } from 'react-native-material-dropdown';
import  MapView  from 'react-native-maps'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import firebase from '../../config';
import Map from '../Map'
import { setTrackThunk } from '../../store/tracks'
import { getContacts } from '../../store/user'
import DateTimePicker from '@react-native-community/datetimepicker';
import Touchable from 'react-native-platform-touchable';

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';



class DummySchedule extends React.Component {

  constructor (props) {
    super (props);
    this.state = {
      targetAddress: '',
      currentLocation: null,
      ETA: new Date (),
      inProgress: false,
      finalLocation: null,
      error: null,
      trackee: '',
      trackers: [],
      dateTimeMode: '',
      dateTimeShow: false,
      oneTime: false
    }
    this.handleAddress = this.handleAddress.bind(this)
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      console.log('no permissions were granted')
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ currentLocation: {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    }
  });
  };

  _attemptGeocodeAsync = async () => {

    this.setState({ inProgress: true, error: null });
    try {
    let location = await Location.geocodeAsync(this.state.targetAddress);
    this.setState({ finalLocation: {
      latitude: location[0].latitude,
      longitude: location[0].longitude
    } });
    } catch (e) {
    this.setState({ error: e.message });
    } finally {
    this.setState({ inProgress: false });
    }
    };


  _maybeRenderResult = () => {
    let { targetAddress, finalLocation } = this.state;
    let text = typeof targetAddress === 'string'
      ? targetAddress
      : JSON.stringify(targetAddress);

    if (this.state.inProgress) {
      return <ActivityIndicator style={{ marginTop: 10 }} />;
    } else if (finalLocation) {
      return (
        <Text style={styles.resultText}>
          {text} resolves to {JSON.stringify(finalLocation)}
        </Text>
      );
    } else if (this.state.error) {
      return (
        <Text style={styles.errorResultText}>
          {text} cannot resolve: {JSON.stringify(this.state.error)}
        </Text>
      );
    }
  };

  _onPress = item => {
    this.setState({
      trackee: item.uid,
    });

  }

  changeTracker = item => {
    let trackers = this.state.trackers
      if(!trackers.includes(item.uid)){
      trackers.push(item.uid)
      this.setState({
        trackers
      })
    } else {
      let newTrackers = trackers.filter(tracker => tracker !== item.uid)
      this.setState({
        trackers: newTrackers
      })
    }
  }

  handleAddress = event => {
    this.setState({
      targetAddress: event.nativeEvent.text
    })
  }

  showDatepicker = () => {
    this.setState({
      dateTimeMode: 'date',
      dateTimeShow: true
    })
  };

  showTimepicker = () => {
    this.setState({
      dateTimeMode: 'time',
      dateTimeShow: true
    })
  };

  // onDateTimeChange = (event, selectedDate) => {
  //   this.setState({
  //     dateTimeShow: false,
  //     ETA: selectedtDate
  //   })
  // };

  componentDidMount () {
    this._getLocationAsync()
    console.log(this.state.ETA)
  }

  render() {
    let data = []
    if(this.props.contacts){
     data = this.props.contacts.map(friend => (
      {value: `${friend.First} ${friend.Last}`,
        uid: friend.uid
      }))
    }
    data.push({value: 'Me', uid: this.props.user.uid})

    return (
        <View style={styles.container}>

        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Trip Destination</Text>
        </View>

        <TextInput
        value={this.state.targetAddress}
        onChange={this.handleAddress}
        placeholder='Enter Address'
        style={styles.inputBox}
        ></TextInput>

        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Who are we safeguarding today?</Text>
        </View>

        <View style={{height: 100, width: "90%"}}>
        <FlatList
        data={data}
        style={[styles.list, {width: "100%"} ]}
        renderItem={({item, index, separators}) => (
          <TouchableHighlight
            key={item.uid}
            style={[styles.listItemCont, this.state.trackee === item.uid ? { backgroundColor: "#4faadb" } : {}]}
            onPress={() => this._onPress(item)}
            onShowUnderlay={separators.highlight}
            onHideUnderlay={separators.unhighlight}>
            <Text style={styles.listItem}>{item.value}</Text>
          </TouchableHighlight>
        )}
        keyExtractor={item => item.uid}
      />
      </View>

      <View style={styles.headerContainer}>
          <Text style={styles.headerText}>What Kind of Alert?</Text>
      </View>

      {!this.state.dateTimeShow && !this.state.location && (<View style={styles.dateTimeContainer}>
        <TouchableOpacity style={styles.dateTimeButton}>
        <Text
          onPress={() => this.props.navigation.navigate('Trip')}>Time-based</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dateTimeButton}>
        <Text
          onPress={() => this.setState({location: true})}>Location-based</Text>
        </TouchableOpacity>
        </View>
      )}
      <Text> </Text>
      { this.state.location ? <View><Text style={styles.textBox}>We'll alert you whenever they arrive at {this.state.finalLocation ? this.state.finalLocation : 'the final destination'}</Text></View> : <></>}


      <View style={styles.dateTimeContainer}>
        <Text style={styles.headerText}>Is This a Recurring Track?</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#2f6380" }}
          thumbColor={{false: "#2f6380", true: "#dcd8dc"}}
          onValueChange={value => this.setState({oneTime: value})}
          value={this.state.oneTime}
          />
      </View>
      {!this.state.recur && (this.state.oneTime===true) ? <View style={styles.recurContainer}>
      <TouchableOpacity style={styles.dateTimeButton}>
        <Text
          onPress={() => this.setState({recur: 'Daily'})}>Daily</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dateTimeButton}>
        <Text
          onPress={() => this.setState({recur: 'Weekly'})}>Weekly</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dateTimeButton}>
        <Text
          onPress={() => this.setState({recur: 'Monthly'})}>Monthly</Text>
        </TouchableOpacity>
      </View>: <></>}
      {this.state.recur && this.state.oneTime===true ? <Text>Schedule will repeate {this.state.recur}</Text> : <></>}

        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Who's Checking In?</Text>
        </View>

        <FlatList
        data={data}
        style={styles.list}
        renderItem={({item, index, separators}) => (
          <TouchableHighlight
            key={item.uid}
            style={[styles.listItemCont, this.state.trackers.includes(item.uid) ? { backgroundColor: "#4faadb" } : {}]}
            onPress={() => this.changeTracker(item)}
            onShowUnderlay={separators.highlight}
            onHideUnderlay={separators.unhighlight}>
            <Text style={styles.listItem}>{item.value}</Text>
          </TouchableHighlight>
        )}
        keyExtractor={item => item.uid}
      />
        <View style={styles.dateTimeContainer}>
        <TouchableOpacity style={styles.button}>
        <Text
          onPress={() => {
          Alert.alert('Success! Your Trip is ready')
          this.props.navigation.navigate('Profile')}
        }
          style={styles.buttonText}>
            Submit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
          <Text onPress={() => {
          this.props.navigation.navigate('All Trips')}
           }
           style={styles.buttonText}>
             See all tracks</Text>
        </TouchableOpacity>
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    padding: 10,
  },
  list: {
   width: '90%',
   height: 5
  },
  listItem: {
    paddingTop: 2,
    paddingBottom: 2,
    fontSize: 18,
  },
  // hr: {
  //   height: 1,
  //   backgroundColor: "gray"
  // },
  listItemCont: {
    flexDirection: "row",
    alignItems: 'flex-start',
  },
  inputBox: {
      width: '90%',
      margin: 5,
      padding: 10,
      fontSize: 16,
      color: '#4faadb',
      borderColor: '#d3d3d3',
      borderRadius: 3,
      borderWidth: 1,
      textAlign: 'center'
  },
  button: {
    marginTop: 5,
    marginBottom: 5,
    paddingVertical: 5,
    alignItems: 'center',
    backgroundColor: '#4faadb',
    borderColor: '#4faadb',
    borderWidth: 1,
    borderRadius: 5,
    width: 150
},
buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
},
  dateTimeContainer: {
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    justifyContent: 'space-between',
  },
  recurContainer: {
    flex: 0.3,
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginVertical: 1,
    justifyContent: 'space-around',
  },
  dateTimeButton: {
    backgroundColor: '#d3d3d3',
    borderColor: '#d3d3d3',
    borderWidth: 1,
    borderRadius: 3,
    width: 150,
    alignItems: 'center',
    padding: 5
},
  buttonSignup: {
      fontSize: 12
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  headerContainer: {
    marginHorizontal: 5,
    marginTop: 5,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 5,
    color: '#4faadb'
  },
  examplesContainer: {
    paddingTop: 15,
    paddingBottom: 5,
    paddingHorizontal: 20,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginTop: 10,
    marginBottom: 5,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  resultText: {
    padding: 20,
  },
  errorResultText: {
    padding: 20,
    color: 'red',
  },
})


const mapDispatchToProps = dispatch => ({
  getContacts: () => dispatch(getContacts()),
   setTrack: (data) => dispatch(setTrackThunk(data))
})

const mapStateToProps = state => ({
  user: state.user,
  contacts: state.user.contacts,
  groups: state.user.groups
})


export default connect(mapStateToProps, mapDispatchToProps)(DummySchedule)


