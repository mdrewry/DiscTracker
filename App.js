import React, { useState, useEffect, Fragment } from "react";
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
import ViewCourse from "./pages/scorecard/ViewCourse";
import Friends from "./pages/friends/Friends";
import ViewFriend from "./pages/friends/ViewFriend";
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
  roundness: 5,
  colors: {
    ...DefaultTheme.colors,
    primary: "#f1faee",
    secondary: "#3a0ca3",
    accent: "#e63946",
    background: "white",
    text: "#000",
    surface: "#a8dadc",
  },
};

export default function App() {
  const [user, setUser] = useState({ loading: true, loggedIn: false });
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const docRef = firestore.collection("users").doc(user.uid);
        const unsubscribeUser = docRef.onSnapshot((snapshot) => {
          const userData = { ...snapshot.data(), id: user.uid };
          setUser({ ...userData, ref: docRef });
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
        <Fragment>
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
                <Stack.Screen name="ViewCourse">
                  {(props) => (
                    <ViewCourse {...props} user={user} theme={theme} />
                  )}
                </Stack.Screen>
                <Stack.Screen name="Friends">
                  {(props) => <Friends {...props} user={user} theme={theme} />}
                </Stack.Screen>
                <Stack.Screen name="ViewFriend">
                  {(props) => (
                    <ViewFriend {...props} user={user} theme={theme} />
                  )}
                </Stack.Screen>
              </Stack.Navigator>
            </NavigationContainer>
          ) : (
            <Login setUser={setUser} />
          )}
        </Fragment>
      )}
    </PaperProvider>
  );
}
