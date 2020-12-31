const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const firestore = admin.firestore();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
exports.userJoined = functions.auth.user().onCreate((user) => {
  const docRef = firestore.collection("users").doc(user.uid);
  docRef.set({
    friends: [],
    groups: [],
    phoneNumber: user.phoneNumber,
    firstName: "",
    lastName: "",
    email: "",
    imageURL: "",
    stats: {
      numGames: 0,
      numHoles: 0,
      numShots: 0,
      numPar: 0,
      numBirdie: 0,
      numEagle: 0,
      numAlbatross: 0,
      numBogey: 0,
      numDoubleBogey: 0,
      numAce: 0,
    },
  });
});
