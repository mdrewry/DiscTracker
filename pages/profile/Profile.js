import React, { useState, useEffect, useRef } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import { Title, Avatar, Text, Subheading } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { auth, storage, firestore } from "../../firebase";
import Page from "../../components/Page";
import CustomCard from "../../components/CustomCard";
import CustomField from "../../components/CustomField";
import CustomButton from "../../components/CustomButton";
import CustomDialog from "../../components/CustomDialog";
export default function Profile({ user, theme, navigation }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [image, setImage] = useState(user.imageURL);
  const [save, setSave] = useState(false);
  const [openResetForm, setOpenResetForm] = useState(false);
  const [openAdminResetForm, setOpenAdminResetForm] = useState(false);
  const [openAdminScriptForm, setOpenAdminScriptForm] = useState(false);
  const [openSignOutForm, setOpenSignOutForm] = useState(false);
  const didMountRef = useRef(false);
  useEffect(() => {
    const getPermissions = async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    };
    if (didMountRef.current) setSave(true);
    else {
      didMountRef.current = true;
      getPermissions();
      return () => getPermissions();
    }
  }, [name, email]);
  const handleLogout = async () => {
    await auth.signOut();
  };
  const saveProfile = async () => {
    await user.ref.update({
      name: name,
      email: email,
    });
    setSave(false);
    Keyboard.dismiss();
  };
  const handleToggleReset = () => {
    setOpenResetForm((curr) => !curr);
  };
  const handleToggleAdminReset = () => {
    setOpenAdminResetForm((curr) => !curr);
  };
  const handleToggleAdminScript = () => {
    setOpenAdminScriptForm((curr) => !curr);
  };
  const handleToggleSignoutForm = () => {
    setOpenSignOutForm((curr) => !curr);
  };
  const resetProfile = async () => {
    await user.ref.update({
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
        numTripleBogey: 0,
        numAce: 0,
        numDNF: 0,
      },
    });
    handleToggleReset();
  };
  const adminResetData = async () => {
    const scoresSnapshot = await firestore.collection("scores").get();
    await Promise.all(
      scoresSnapshot.docs.map(async (doc) => {
        await doc.ref.delete();
      })
    );
    const usersSnapshot = await firestore.collection("users").get();
    await Promise.all(
      usersSnapshot.docs.map(async (doc) => {
        await doc.ref.update({
          currentGame: "",
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
            numTripleBogey: 0,
            numAce: 0,
            numDNF: 0,
          },
        });
      })
    );
    handleToggleAdminReset();
  };
  const adminScript = async () => {
    // Script goes here
    console.log("ran script");
    handleToggleAdminScript();
  };
  const upload = async (uri) => {
    let imageBlob = null;
    await fetch(uri).then(async (response) => {
      imageBlob = await response.blob();
    });
    let getURL = "";
    await storage.ref(`userDocuments/${user.id}/profilePhoto`).put(imageBlob);
    await storage
      .ref()
      .child(`userDocuments/${user.id}/profilePhoto`)
      .getDownloadURL()
      .then((url) => {
        getURL = url;
      });
    setImage(getURL);
    await user.ref.update({ imageURL: getURL });
  };

  const handleImageUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    if (!result.cancelled) {
      await upload(result.uri);
    }
  };
  return (
    <Page navigation={navigation} title="Profile" user={user} theme={theme}>
      <CustomCard theme={theme}>
        <View style={styles.rowCenter}>
          <Avatar.Image
            size={90}
            source={{ uri: image }}
            onPress={handleImageUpload}
          />
          <View style={styles.titleWrapper}>
            <Subheading>Welcome Back,</Subheading>
            <Title>{user.name ? user.name : user.phoneNumber}</Title>
          </View>
        </View>
      </CustomCard>
      <CustomCard theme={theme}>
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
        <View style={styles.text} />
        <CustomButton
          text={save ? "Save" : "Saved!"}
          handlePress={saveProfile}
          disabled={!save}
        />
      </CustomCard>

      <CustomCard theme={theme}>
        <Subheading>Settings</Subheading>
        <View style={styles.text} />
        <CustomButton
          text="Sign Out"
          handlePress={handleToggleSignoutForm}
          disabled={false}
        />
        <CustomDialog
          visible={openSignOutForm}
          setVisible={setOpenSignOutForm}
          type="Attention"
          prompt="Signing out will require you to re-verify your device in the future."
        >
          <CustomButton
            text="Cancel"
            handlePress={handleToggleSignoutForm}
            disabled={false}
          />
          <View style={styles.buttonSpacer} />
          <CustomButton text="Confirm" handlePress={handleLogout} />
        </CustomDialog>

        <View style={styles.text} />
        <CustomButton
          text="Reset Stats"
          handlePress={handleToggleReset}
          disabled={false}
        />
        <CustomDialog
          visible={openResetForm}
          setVisible={handleToggleReset}
          type="Attention"
          prompt="You are about to permanently reset all statistics recorded on this account."
        >
          <CustomButton
            text="Cancel"
            handlePress={handleToggleReset}
            disabled={false}
          />
          <View style={styles.buttonSpacer} />
          <CustomButton text="Confirm" handlePress={resetProfile} />
        </CustomDialog>
      </CustomCard>
      {user.admin && (
        <CustomCard theme={theme}>
          <Subheading>Admin Settings</Subheading>
          <View style={styles.text} />
          <CustomButton
            text="Reset All Stats/Scores"
            handlePress={handleToggleAdminReset}
            disabled={false}
          />
          <CustomDialog
            visible={openAdminResetForm}
            setVisible={handleToggleAdminReset}
            type="Attention"
            prompt="You are about to reset the database scores and user stats."
          >
            <CustomButton
              text="Cancel"
              handlePress={handleToggleAdminReset}
              disabled={false}
            />
            <View style={styles.buttonSpacer} />
            <CustomButton text="Confirm" handlePress={adminResetData} />
          </CustomDialog>
          <View style={styles.text} />
          <CustomButton
            text="Run Script"
            handlePress={handleToggleAdminScript}
            disabled={false}
          />
          <CustomDialog
            visible={openAdminScriptForm}
            setVisible={handleToggleAdminScript}
            type="Attention"
            prompt="You are about to run a custom script."
          >
            <CustomButton
              text="Cancel"
              handlePress={handleToggleAdminScript}
              disabled={false}
            />
            <View style={styles.buttonSpacer} />
            <CustomButton text="Confirm" handlePress={adminScript} />
          </CustomDialog>
        </CustomCard>
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  titleWrapper: {
    marginLeft: 20,
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
  buttonSpacer: {
    width: 20,
  },
});
