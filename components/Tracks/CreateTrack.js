import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions, ActivityIndicator, FlatList, TouchableHighlight, Platform} from 'react-native'
import { connect } from 'react-redux'
import { setTrackThunk } from '../../store/tracks'
import { getContacts } from '../../store/user'
import DateTimePicker from '@react-native-community/datetimepicker';

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';



class TrackForm extends React.Component {

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
      dateTimeShow: false
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

  componentDidMount () {
    this._getLocationAsync()
    // console.log(this.state.ETA)
  }

  render() {
    let data = []
    if(this.props.contacts){
     data = this.props.contacts
      .filter(friend => friend.status === 'accepted')
      .map(friend => (
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
          <Text style={styles.headerText}>What is the ETA?</Text>
      </View>

        <Text style={[styles.inputBoxText, {fontSize: 20, marginBottom: 5, color: '#4faadb'}]}>{this.state.ETA.toLocaleDateString()} {this.state.ETA.toLocaleTimeString()}</Text>

      {!this.state.dateTimeShow && (<View style={styles.dateTimeContainer}>
        <TouchableOpacity style={styles.dateTimeButton}>
        <Text
          onPress={() => this.showDatepicker()}>Change Date</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dateTimeButton}>
        <Text
          onPress={() => this.showTimepicker()}>Change Time</Text>
        </TouchableOpacity>
        </View>
      )}

        {this.state.dateTimeShow && (
        <View style={{width: "90%", alignItems: 'center'}}>
        <DateTimePicker
          style={{width: "90%"}}
          value={this.state.ETA}
          mode={this.state.dateTimeMode}
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || this.state.ETA
            if (Platform.OS !== 'ios') {
              this.setState ({
                dateTimeShow: false
              })
            }
            this.setState({ETA: currentDate})
          }}
        />
        <TouchableOpacity style={styles.dateTimeButton}>
        <Text style={styles.buttonText}
          onPress={() =>
          {this.setState({dateTimeShow: false})
          }}>{`Set ${this.state.dateTimeMode}`}</Text>
        </TouchableOpacity>
        </View>
        )}

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
          onPress={async () => {
          const finDest = await this._attemptGeocodeAsync()
          this.props.setTrack(this.state)
          this.props.navigation.navigate('All Trips')}
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
    fontSize: 20,
  },
  listItemCont: {
    flexDirection: "row",
    alignItems: 'flex-start',
  },
  inputBox: {
      width: '90%',
      margin: 10,
      padding: 15,
      fontSize: 16,
      color: '#4faadb',
      borderColor: '#d3d3d3',
      borderRadius: 3,
      borderWidth: 1,
      textAlign: 'center'
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
    width: 150
},
buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff'
},
  dateTimeContainer: {
    flex: 0.3,
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    justifyContent: 'space-between',
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
  headerContainer: {
    marginHorizontal: 5,
    marginTop: 20,
  },
  headerText: {
    fontSize: 22,
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
})


export default connect(mapStateToProps, mapDispatchToProps)(TrackForm)


