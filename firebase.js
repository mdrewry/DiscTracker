import * as firebase from "firebase";

export const firebaseConfig = {
  apiKey: "AIzaSyAxWg2xdpE6THAPIhXOY27QJYQb_aGT2AU",
  authDomain: "disc-performance-tracker.firebaseapp.com",
  projectId: "disc-performance-tracker",
  storageBucket: "disc-performance-tracker.appspot.com",
  messagingSenderId: "942897683992",
  appId: "1:942897683992:web:5da09318607b0a64586d6d",
  measurementId: "G-9PJNNHWB2L",
};

firebase.initializeApp(firebaseConfig);
export const Firebase = firebase;
