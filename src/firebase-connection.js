import config from './firebase-config' // podłączenie firebase
import firebase from 'firebase'

firebase.initializeApp(config);

const fb= firebase;
export default fb;