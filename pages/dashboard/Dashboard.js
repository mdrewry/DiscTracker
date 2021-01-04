import React from "react";
import { StyleSheet, View } from "react-native";
import { Title } from "react-native-paper";
import Page from "../../components/Page";
import CustomCard from "../../components/CustomCard";
import StatObj, { StatHeader } from "../../components/StatObj";
import PlayerStats, { PlayerStatsHeader } from "../../components/PlayerStats";
export default function Dashboard({ user, theme, navigation }) {
  return (
    <Page navigation={navigation} title="Dashboard" user={user} theme={theme}>
      <PlayerStatsHeader theme={theme} stats={user.stats} />
      <PlayerStats theme={theme} stats={user.stats} />
      <CustomCard>
        <Title>Previous Games</Title>
      </CustomCard>
    </Page>
  );
}

const styles = StyleSheet.create({
  surface: {
    elevation: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    padding: 20,
    borderRadius: 5,
  },
  title: {
    marginTop: 20,
  },
  filler: {
    flexGrow: 1,
  },
  rowCenter: {
    display: "flex",
    flexDirection: "row",
  },
});
