import React, { useState, Fragment } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Title, Appbar } from "react-native-paper";
export default function Page({ navigation, title, children, theme, user }) {
  return (
    <Fragment>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.Content
          title={title}
          subtitle={user.name ? user.name : user.phoneNumber}
          subtitleStyle={{ marginBottom: 10 }}
        />
        <Appbar.Action
          icon="flag-checkered"
          size={20}
          onPress={() => {
            navigation.navigate("ScoreCard");
          }}
        />
        <Appbar.Action
          icon="view-dashboard"
          size={20}
          onPress={() => {
            navigation.navigate("Dashboard");
          }}
        />
        <Appbar.Action
          icon="account-group"
          size={20}
          onPress={() => {
            navigation.navigate("Friends");
          }}
        />
        <Appbar.Action
          icon="account-circle"
          size={20}
          onPress={() => {
            navigation.navigate("Profile");
          }}
        />
      </Appbar.Header>
      <SafeAreaView style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.main}
        >
          {children}
          <View style={styles.marginTop} />
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  );
}

export const PageCenter = ({ children }) => {
  return (
    <View style={styles.container}>
      <View style={styles.centerMain}>{children}</View>
    </View>
  );
};

export const LoadingPage = ({ theme }) => {
  const messages = [
    "Don't Be a Dirty Discer",
    "Even Berry Schultz Loses Discs",
    "The Arborist Fears No Tree",
  ];
  const [dispMessage, setDispMessage] = useState(
    messages[Math.floor(Math.random() * Math.floor(messages.length))]
  );
  return (
    <View style={styles.container}>
      <View
        style={{ ...styles.centerMain, backgroundColor: theme.colors.surface }}
      >
        <ActivityIndicator size="large" color={theme.colors.accent} />
        <Title>{dispMessage}</Title>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    minHeight: "100%",
    paddingLeft: 20,
    paddingRight: 20,
  },
  marginTop: {
    marginTop: 20,
  },
  titleMargin: {
    marginLeft: 10,
  },
  filler: {
    flexGrow: 1,
  },
  centerMain: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
