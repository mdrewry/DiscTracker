import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import { Firebase } from "./firebase";
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
    const unsubscribeAuth = Firebase.auth().onAuthStateChanged((user) => {
      if (user) setUser(user);
      else setUser(null);
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
