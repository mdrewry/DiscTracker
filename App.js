import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import { firestore, auth } from "./firebase";
import { LogBox } from "react-native";
import _ from "lodash";

LogBox.ignoreLogs(["Setting a timer"]);
const _console = _.clone(console);
console.warn = (message) => {
  if (message.indexOf("Setting a timer") <= -1) {
    _console.warn(message);
  }
};

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#3498db",
    accent: "#f1c40f",
  },
};

export default function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = firestore.collection("users").doc(user.uid);
        const doc = await docRef.get();
        setUser({ ...user, ...doc });
      } else setUser(null);
    });
    return () => {
      unsubscribeAuth();
    };
  }, []);

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        {user ? <Dashboard user={user} setUser={setUser} /> : <Login />}
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
});
