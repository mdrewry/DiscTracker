import React from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Title, IconButton } from "react-native-paper";
import CustomCard from "./CustomCard";
export default function Page({ navigation, title, children }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appBarWrapper}>
        <CustomCard cardStyle={styles.appBarCard}>
          <View style={styles.appbar}>
            <Title style={styles.titleMargin}>{title}</Title>
            <View style={styles.filler} />
            <IconButton
              icon="flag-checkered"
              size={25}
              onPress={() => {
                navigation.navigate("ScoreCard");
              }}
            />
            <IconButton
              icon="view-dashboard"
              size={25}
              onPress={() => {
                navigation.navigate("Dashboard");
              }}
            />
            <IconButton
              icon="account-circle"
              size={25}
              onPress={() => {
                navigation.navigate("Profile");
              }}
            />
          </View>
        </CustomCard>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.main}>
        {children}
        <View style={styles.marginTop} />
      </ScrollView>
    </SafeAreaView>
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
  return (
    <View style={styles.container}>
      <View
        style={{ ...styles.centerMain, backgroundColor: theme.colors.surface }}
      >
        <ActivityIndicator size="large" color={theme.colors.accent} />
        <Title>Dont Be a Dirty Discer</Title>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1 },
  main: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
  },
  appBarWrapper: {
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  appBarCard: {
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  appbar: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
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
