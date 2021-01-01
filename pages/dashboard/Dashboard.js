import React from "react";
import { StyleSheet, View } from "react-native";
import { Title, Text, Subheading, Avatar, Surface } from "react-native-paper";
import NavPage from "../../components/NavPage";
import CustomCard from "../../components/CustomCard";
export default function Dashboard({ user, theme, navigation }) {
  console.log(typeof user);
  return (
    <NavPage navigation={navigation} title="Dashboard">
      <CustomCard style={styles.statsCard}>
        <Title>Summary & Performance</Title>
        <View>
          <Subheading>Overall</Subheading>
          <View style={styles.rowCenter}>
            <Text># Games</Text>
            <View style={styles.filler} />
            <Text>{user.stats.numGames}</Text>
          </View>
          <View style={styles.rowCenter}>
            <Text># Holes</Text>
            <View style={styles.filler} />
            <Text>{user.stats.numHoles}</Text>
          </View>
          <View style={styles.rowCenter}>
            <Text># Shots</Text>
            <View style={styles.filler} />
            <Text>{user.stats.numShots}</Text>
          </View>
        </View>
        <View>
          <Subheading>Performance</Subheading>
          <View style={styles.rowCenter}>
            <Text># Par</Text>
            <View style={styles.filler} />
            <Text>{user.stats.numPar}</Text>
          </View>
          <View style={styles.rowCenter}>
            <Text># Bogey</Text>
            <View style={styles.filler} />
            <Text>{user.stats.numBogey}</Text>
          </View>
          <View style={styles.rowCenter}>
            <Text># Birdie</Text>
            <View style={styles.filler} />
            <Text>{user.stats.numPar}</Text>
          </View>
        </View>
      </CustomCard>
      <CustomCard>
        <Title>New Game</Title>
        <View style={styles.rowCenter}>
          <Surface
            style={{
              backgroundColor: theme.colors.accent,
              ...styles.surface,
            }}
          >
            <Avatar.Icon size={50} icon="account" />
            <Subheading>Solo Game</Subheading>
          </Surface>
          <View style={styles.filler} />
          <Surface
            style={{
              backgroundColor: theme.colors.accent,
              ...styles.surface,
            }}
          >
            <Avatar.Icon size={50} icon="account-group" />
            <Subheading>Group Game</Subheading>
          </Surface>
        </View>
      </CustomCard>
      <CustomCard>
        <Title>Find Friends</Title>
      </CustomCard>
    </NavPage>
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
    width: "48%",
  },
  filler: {
    flexGrow: 1,
  },
  rowCenter: {
    display: "flex",
    flexDirection: "row",
  },
});
