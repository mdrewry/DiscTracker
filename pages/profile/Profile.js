import React, { useState, useEffect, useRef } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import { Title, Avatar, Text, Subheading, Button } from "react-native-paper";
import { launchImageLibrary, ImagePicker } from "react-native-image-picker";
import { auth, firestore } from "../../firebase";
import NavPage from "../../components/NavPage";
import CustomCard from "../../components/CustomCard";
import CustomField from "../../components/CustomField";
import CustomButton from "../../components/CustomButton";
import CustomDialog from "../../components/CustomDialog";
export default function Profile({ user, setUser, theme, navigation }) {
  const docRef = firestore.collection("users").doc(user.id);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [save, setSave] = useState(false);
  const [openResetForm, setOpenResetForm] = useState(false);
  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) setSave(true);
    else didMountRef.current = true;
  }, [name, email]);
  const handleLogout = async () => {
    await auth
      .signOut()
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
  };
  const saveProfile = async () => {
    await docRef.update({
      name: name,
      email: email,
    });
    setSave(false);
    Keyboard.dismiss();
  };
  const handleResetPressed = () => {
    setOpenResetForm(true);
  };
  const handleResetFalse = () => {
    setOpenResetForm(false);
  };
  const resetProfile = async () => {
    await docRef.update({
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
    handleResetFalse();
  };
  const handleImageUpload = async () => {
    let imageURI = "";
    let options = {
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
        alert(response.customButton);
      } else {
        imageURI = response.uri;
      }
    });
  };
  return (
    <NavPage navigation={navigation} title="Profile">
      <CustomCard>
        <View style={styles.rowCenter}>
          <Avatar.Image
            size={90}
            source={user.imageURL}
            onPress={handleImageUpload}
          />
          <View style={styles.titleWrapper}>
            <Subheading>Welcome Back,</Subheading>
            <Title>{user.name ? user.name : user.phoneNumber}</Title>
          </View>
        </View>
      </CustomCard>
      <CustomCard>
        <Subheading>Edit Profile</Subheading>
        <Text style={styles.text}>Name</Text>
        <CustomField
          value={name}
          setValue={setName}
          placeholder={"Berry Schultz"}
          editable={true}
          autoFocus={false}
        />
        <Text style={styles.text}>Email</Text>
        <CustomField
          value={email}
          setValue={setEmail}
          placeholder={"berryschultz@legendz.com"}
          editable={true}
          autoFocus={false}
        />
        <View style={styles.text} />
        <CustomButton
          text="Change Profile Image"
          handlePress={handleImageUpload}
          disabled={false}
        />
      </CustomCard>

      <CustomCard>
        <Subheading>Settings</Subheading>
        <View style={styles.text} />
        <CustomButton
          text="Sign Out"
          handlePress={handleLogout}
          disabled={false}
        />
        <View style={styles.text} />
        <CustomButton
          text="Reset Stats"
          handlePress={handleResetPressed}
          disabled={false}
        />
        <CustomDialog
          visible={openResetForm}
          setVisible={setOpenResetForm}
          type="Attention"
          prompt="You are about to permanently reset all statistics recorded on this account."
        >
          <CustomButton
            text="Cancel"
            handlePress={handleResetFalse}
            disabled={false}
          />
          <CustomButton text="Confirm" handlePress={resetProfile} />
        </CustomDialog>
      </CustomCard>
      <View style={styles.filler} />
      <CustomCard>
        <CustomButton
          text={save ? "Save" : "Saved!"}
          handlePress={saveProfile}
          disabled={!save}
        />
      </CustomCard>
    </NavPage>
  );
}

const styles = StyleSheet.create({
  titleWrapper: {
    marginLeft: 40,
  },
  text: {
    marginTop: 20,
  },
  filler: {
    flexGrow: 1,
  },
  rowCenter: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});
