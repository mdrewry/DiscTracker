import { ThemeProvider } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { Appbar, Title } from "react-native-paper";
import { ColumnCard } from "./CustomCard";
export default function Page({ title, enableCancel, children, navigation }) {
  return (
    <View style={styles.container}>
      <Appbar style={styles.appbar}>
        <Appbar.Content title={title}></Appbar.Content>
        {enableCancel && (
          <Appbar.Action
            icon="window-close"
            size={30}
            onPress={() => {
              navigation.navigate("Dashboard");
            }}
          />
        )}
      </Appbar>

      <View style={styles.main}>{children}</View>
    </View>
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
  appbar: {
    position: "absolute",
    width: "100%",
    height: 100,
    paddingTop: 30,
  },
  main: {
    flex: 1,
    padding: 20,
    marginTop: 80,
  },
  centerMain: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
