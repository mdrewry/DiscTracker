import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Caption, Title, Avatar } from "react-native-paper";
import {
  FirebaseRecaptchaVerifierModal,
  FirebaseRecaptchaBanner,
} from "expo-firebase-recaptcha";
import {
  Firebase,
  firebaseConfig,
  auth,
  firestore,
  storage,
} from "../../firebase";
import CustomCard, { ColumnCard } from "../../components/CustomCard";
import { PhoneField, CodeField } from "../../components/CustomField";
import CustomButton from "../../components/CustomButton";
export default function Login({ setUser }) {
  const captchaRef = useRef(null);
  const [phoneNumberDisplay, setPhoneNumberDisplay] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [verificationCode, setVerificationCode] = useState();
  const [verificationID, setVerificationID] = useState();
  const [message, setMessage] = useState();
  const sendVerificationCode = async () => {
    try {
      const phoneNumber = "+" + phoneNumberDisplay.replace(/[- )(]/g, "");
      setPhoneNumber(phoneNumber);
      const phoneProvider = new Firebase.auth.PhoneAuthProvider();
      const verificationID = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        captchaRef.current
      );
      setVerificationID(verificationID);
      if (phoneNumber.length !== 12)
        setMessage({
          text:
            "Error processing phone number. Make sure to include the country code (1 for US)",
          error: true,
        });
      setMessage({
        text: "Verification code has been sent to your phone.",
        error: false,
      });
    } catch (error) {
      setMessage({ text: error.message, error: true });
    }
  };
  const handleLogin = async () => {
    try {
      const credential = Firebase.auth.PhoneAuthProvider.credential(
        verificationID,
        verificationCode
      );
      setUser({ loading: true, loggedIn: false });
      await auth.signInWithCredential(credential).then(async (response) => {
        const { user } = response;
        const docRef = firestore.collection("users").doc(user.uid);
        const doc = await docRef.get();
        if (!doc.exists) {
          let getURL = "";
          await storage
            .ref()
            .child(`defaults/defaultImage.png`)
            .getDownloadURL()
            .then((url) => {
              getURL = url;
            });
          docRef.set({
            admin: false,
            friends: ["placeholder"],
            friendsRequested: ["placeholder"],
            incomingFriendRequests: ["placeholder"],
            groups: [],
            phoneNumber: user.phoneNumber,
            name: "",
            email: "",
            imageURL: getURL,
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
            currentGame: "",
            updateGameToggle: false,
            loggedIn: true,
            loading: false,
          });
        }
        setMessage({
          text: "Phone Authentication Successful 👍",
          error: false,
        });
      });
    } catch (error) {
      setUser({ loading: false, loggedIn: false });
      setMessage({ text: error.message, error: true });
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.fill} />
      <ColumnCard>
        <Title style={styles.headerText}>Welcome to DiscTracker</Title>
        <Avatar.Icon size={100} icon="chart-bubble" />
      </ColumnCard>
      <View style={styles.fill} />
      <FirebaseRecaptchaVerifierModal
        ref={captchaRef}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification={true}
      />
      <CustomCard>
        <PhoneField
          value={phoneNumberDisplay}
          setValue={setPhoneNumberDisplay}
          autoFocus={true}
          editable={true}
        />
        <CustomButton
          text="Send Verification Code"
          icon="send"
          disabled={!phoneNumberDisplay}
          handlePress={sendVerificationCode}
        />
        <View style={styles.section} />
        <CodeField
          setValue={setVerificationCode}
          editable={!!verificationID}
          autoFocus={false}
        />
        <CustomButton
          text="Cofirm Verification Code"
          disabled={!!!verificationID}
          handlePress={handleLogin}
        />
      </CustomCard>
      <View style={styles.fill} />
      <View style={styles.footer}>
        {message ? (
          <Caption style={{ color: message.error ? "red" : "green" }}>
            {message.text}
          </Caption>
        ) : undefined}
        <FirebaseRecaptchaBanner />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  section: {
    marginTop: 20,
  },
  headerSection: {
    height: 200,
  },
  headerText: {
    marginBottom: 20,
  },
  fill: {
    flexGrow: 1,
  },
  footer: {
    alignSelf: "center",
  },
});
