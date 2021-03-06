import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import firebase, {firestore} from '../config'

// const PUSH_ENDPOINT = 'https://your-server.com/users/push-token';

export default async function registerForPushNotificationsAsync() {
  //Check for existing permissions
  const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  let finalStatus = status;
  //If no existing permission, ask user for permission
  if (finalStatus !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
    }
  if (finalStatus !== 'granted') {
    alert('No notification permissions!');
    return;
  }
  // Get the token that identifies this device
  let token = await Notifications.getExpoPushTokenAsync();
  console.log(token)

  //Add token to the firebase
  let uid = firebase.auth().currentUser.uid
  firestore
    .collection('users')
    .doc(uid)
    .update({pushToken: token})
}
