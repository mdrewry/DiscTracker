import * as React from "react";
import { StyleSheet } from "react-native";
import { Card } from "react-native-paper";

export default function CustomCard({ children }) {
  return (
    <Card style={styles.card}>
      <Card.Content>{children}</Card.Content>
    </Card>
  );
}
export const ColumnCard = ({ children }) => {
  return (
    <Card style={styles.card}>
      <Card.Content style={styles.col}>{children}</Card.Content>
    </Card>
  );
};
const styles = StyleSheet.create({
  card: {
    marginTop: 20,
  },
  col: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
