import React, { useState, useEffect, Fragment } from "react";
import { View, StyleSheet } from "react-native";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { LogBox } from "react-native";
import _ from "lodash";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { firestore, auth } from "./firebase";
import { LoadingPage } from "./components/Page";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Profile from "./pages/profile/Profile";
import ScoreCard from "./pages/scorecard/ScoreCard";
import Friends from "./pages/friends/Friends";
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
  const [user, setUser] = useState({ loading: true, loggedIn: false });
  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = firestore.collection("users").doc(user.uid);
        const unsubscribeUser = docRef.onSnapshot(async (snapshot) => {
          const userData = { ...snapshot.data(), id: user.uid };
          setUser({ ...userData, loading: false, loggedIn: true, ref: docRef });
        });
        return () => unsubscribeUser();
      } else {
        setUser({ loading: false, loggedIn: false });
      }
    });
  }, []);
  return (
    <PaperProvider theme={theme}>
      {user.loading ? (
        <LoadingPage theme={theme} />
      ) : (
        <View style={styles.container}>
          {user.loggedIn ? (
            <NavigationContainer>
              <Stack.Navigator
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="Dashboard">
                  {(props) => (
                    <Dashboard {...props} user={user} theme={theme} />
                  )}
                </Stack.Screen>
                <Stack.Screen name="Profile">
                  {(props) => <Profile {...props} user={user} theme={theme} />}
                </Stack.Screen>
                <Stack.Screen name="ScoreCard">
                  {(props) => (
                    <ScoreCard {...props} user={user} theme={theme} />
                  )}
                </Stack.Screen>
                <Stack.Screen name="Friends">
                  {(props) => <Friends {...props} user={user} theme={theme} />}
                </Stack.Screen>
              </Stack.Navigator>
            </NavigationContainer>
          ) : (
            <Login />
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
