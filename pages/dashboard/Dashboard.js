import React from "react";
import Page from "../../components/Page";
import PlayerStats, { PlayerStatsHeader } from "../../components/PlayerStats";

export default function Dashboard({ user, theme, navigation }) {
  return (
    <Page navigation={navigation} title="Dashboard" user={user} theme={theme}>
      <PlayerStatsHeader theme={theme} stats={user.stats} />
      <PlayerStats theme={theme} stats={user.stats} />
    </Page>
  );
}
