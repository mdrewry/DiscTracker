import React, { useState, useEffect, Fragment } from "react";
import { View, StyleSheet } from "react-native";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Profile from "./pages/profile/Profile";
import { firestore, auth } from "./firebase";
import { LogBox } from "react-native";
import _ from "lodash";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Stack = createStackNavigator();
LogBox.ignoreLogs(["Setting a timer"]);
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
    primary: "#560bad",
    secondary: "#3a0ca3",
    accent: "#f72585",
    background: "white",
    text: "#FFF",
    surface: "#3f37c9",
  },
};

export default function App() {
  const [user, setUser] = useState(async () => {
    const userData = await AsyncStorage.getItem("userData");
    if (userData) return userData;
    return null;
  });
  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = firestore.collection("users").doc(user.uid);
        const unsubscribeUser = docRef.onSnapshot(async (snapshot) => {
          const userData = { ...snapshot.data(), id: user.uid };
          await AsyncStorage.setItem("userData", JSON.stringify(userData));
          setUser(userData);
        });
        return () => unsubscribeUser();
      } else {
        setUser(null);
        await AsyncStorage.setItem("userData", null);
      }
    });
  }, []);
  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        {!user || user.name === undefined ? (
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
            </Stack.Navigator>
          </NavigationContainer>
        )}
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
