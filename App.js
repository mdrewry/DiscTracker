import React, { useState, useEffect, Fragment } from "react";
import { View, StyleSheet } from "react-native";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { LogBox } from "react-native";
import _ from "lodash";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firestore, auth } from "./firebase";
import { LoadingPage } from "./components/Page";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Profile from "./pages/profile/Profile";
import ScoreCard from "./pages/scorecard/ScoreCard";
const Stack = createStackNavigator();

LogBox.ignoreAllLogs(true);
const _console = _.clone(console);
console.warn = (message) => {
  if (message.indexOf("Setting a timer") <= -1) {
    _console.warn(message);
  }
};
const theme = {
  ...DefaultTheme,
  roundness: 15,
  colors: {
    ...DefaultTheme.colors,
    primary: "#560bad",
    secondary: "#3a0ca3",
    accent: "#f72585",
    background: "white",
    text: "#FFF",
    surface: "#3f37c9",
  },
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = firestore.collection("users").doc(user.uid);
        const unsubscribeUser = docRef.onSnapshot(async (snapshot) => {
          const userData = { ...snapshot.data(), id: user.uid };
          setUser({ ...userData, ref: docRef });
        });
        setLoading(false);
        return () => unsubscribeUser();
      } else {
        setUser(null);
        setLoading(false);
      }
    });
  }, []);
  return (
    <PaperProvider theme={theme}>
      {loading ? (
        <LoadingPage theme={theme} />
      ) : (
        <View style={styles.container}>
          {!user ? (
            <Login />
          ) : (
            <NavigationContainer>
              <Stack.Navigator
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="Dashboard">
                  {(props) => (
                    <Dashboard
                      {...props}
                      user={user}
                      setUser={setUser}
                      theme={theme}
                    />
                  )}
                </Stack.Screen>
                <Stack.Screen name="Profile">
                  {(props) => (
                    <Profile {...props} user={user} setUser={setUser} />
                  )}
                </Stack.Screen>
                <Stack.Screen name="ScoreCard">
                  {(props) => (
                    <ScoreCard {...props} user={user} theme={theme} />
                  )}
                </Stack.Screen>
              </Stack.Navigator>
            </NavigationContainer>
          )}
        </View>
      )}
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
