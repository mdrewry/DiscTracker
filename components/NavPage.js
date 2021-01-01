import React from "react";
import { StyleSheet, View } from "react-native";
import { Appbar } from "react-native-paper";

export default function NavPage({ navigation, title, children }) {
  return (
    <View style={styles.container}>
      <Appbar style={styles.appbar}>
        <Appbar.Content title={title}></Appbar.Content>
        <Appbar.Action
          icon="view-dashboard"
          size={30}
          onPress={() => {
            navigation.navigate("Dashboard");
          }}
        />
        <Appbar.Action
          icon="account-circle"
          size={30}
          onPress={() => {
            navigation.navigate("Profile");
          }}
        />
      </Appbar>
      <View style={styles.main}>{children}</View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  main: {
    flex: 1,
    padding: 20,
    marginTop: 80,
  },
  appbar: {
    position: "absolute",
    width: "100%",
    height: 100,
    paddingTop: 30,
  },
});
