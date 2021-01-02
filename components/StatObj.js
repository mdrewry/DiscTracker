import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Surface, Text, Avatar, Title } from "react-native-paper";

export default function StatObj({ label, valueA, valueB, theme }) {
  return (
    <View style={styles.rowCenter}>
      <Text>{label}</Text>
      <View style={styles.filler} />
      {valueB && <StatVar value={valueB} theme={theme} />}
      <StatVar value={valueA} theme={theme} />
    </View>
  );
}
export const StatHeader = ({ label, valueA, valueB, theme }) => {
  return (
    <View style={styles.rowCenterTitle}>
      <Title>{label}</Title>
      <View style={styles.filler} />
      {valueB && <StatVar value={valueB} theme={theme} />}
      <StatVar value={valueA} theme={theme} />
    </View>
  );
};

export const StatVar = ({ value, theme }) => {
  return (
    <Surface
      style={{ ...styles.surface, backgroundColor: theme.colors.accent }}
    >
      <Text>{value}</Text>
    </Surface>
  );
};
const styles = StyleSheet.create({
  card: {},
  surface: {
    elevation: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    marginRight: 10,
    width: 50,
    height: 30,
    borderRadius: 12,
  },
  col: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  rowCenter: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  rowCenterTitle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  filler: {
    flexGrow: 1,
  },
});
