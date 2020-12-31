import React, { useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, TextInput, Caption, Title, Card } from "react-native-paper";
import {
  FirebaseRecaptchaVerifierModal,
  FirebaseRecaptchaBanner,
} from "expo-firebase-recaptcha";
import { Firebase, firebaseConfig, auth, firestore } from "../../firebase";

export default function Login() {
  const captchaRef = useRef(null);
  const [phoneNumberDisplay, setPhoneNumberDisplay] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [verificationCode, setVerificationCode] = useState();
  const [verificationID, setVerificationID] = useState();
  const [message, setMessage] = useState();

  const sendVerificationCode = async () => {
    try {
      const phoneNumber = phoneNumberDisplay.replace(/[- )(]/g, "");
      setPhoneNumber(phoneNumber);
      const phoneProvider = new Firebase.auth.PhoneAuthProvider();
      const verificationID = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        captchaRef.current
      );
      setVerificationID(verificationID);
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
      await auth.signInWithCredential(credential).then(async (response) => {
        setMessage({
          text: "Phone Authentication Successful 👍",
          error: false,
        });
      });
    } catch (error) {
      setMessage({ text: error.message, error: true });
    }
  };
  return (
    <View style={styles.container}>
      <Title>Login</Title>
      <FirebaseRecaptchaVerifierModal
        ref={captchaRef}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification={true}
      />
      <TextInput
        placeholder="+1 999 999 9999"
        autoFocus
        autoCompleteType="tel"
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
        onChangeText={setPhoneNumberDisplay}
      />
      <Button disabled={!phoneNumberDisplay} onPress={sendVerificationCode}>
        Send Verification Code
      </Button>
      <TextInput
        placeholder="123456"
        editable={!!verificationID}
        onChangeText={setVerificationCode}
      />
      <Button disabled={!verificationID} onPress={handleLogin}>
        Cofirm Verification Code
      </Button>
      {message ? (
        <Card style={{ backgroundColor: message.error ? "red" : "green" }}>
          <Caption>{message.text}</Caption>
        </Card>
      ) : undefined}
      <FirebaseRecaptchaBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
});
