import React, { useState, useEffect, useRef } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import { Title, Avatar, Text, Subheading, Button } from "react-native-paper";
import { launchImageLibrary } from "react-native-image-picker";
import { auth, firestore } from "../../firebase";
import NavPage from "../../components/NavPage";
import CustomCard from "../../components/CustomCard";
import CustomField from "../../components/CustomField";
import CustomButton from "../../components/CustomButton";
export default function Profile({ user, setUser, theme, navigation }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [save, setSave] = useState(false);
  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) setSave(true);
    else didMountRef.current = true;
  }, [name, email]);
  const saveProfile = async () => {
    const docRef = firestore.collection("users").doc(user.id);
    await docRef.update({
      name: name,
      email: email,
    });
    setSave(false);
    Keyboard.dismiss();
  };
  const handleImageUpload = async () => {
    console.log("test");
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
