import React from "react";
import { StyleSheet, View } from "react-native";
import { Title, Button } from "react-native-paper";
import { auth } from "../../firebase";
export default function Dashboard({ user, setUser }) {
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
  return (
    <View style={styles.container}>
      <Title>Hello {user.phoneNumber}</Title>
      <Button onPress={handleLogout}>logout</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
});
