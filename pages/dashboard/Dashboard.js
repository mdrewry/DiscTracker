import React from "react";
import { StyleSheet, View } from "react-native";
import { Title, Text, Subheading, Avatar, Surface } from "react-native-paper";
import NavPage from "../../components/NavPage";
import CustomCard from "../../components/CustomCard";
import { EmptyButton } from "../../components/CustomButton";
export default function Dashboard({ user, theme, navigation }) {
  const handleGameButton = () => {
    navigation.navigate("ScoreCard");
  };
  return (
    <NavPage navigation={navigation} title="Dashboard">
      <CustomCard>
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
        <Title>Play Game</Title>
        <EmptyButton
          style={{ backgroundColor: theme.colors.accent, ...styles.surface }}
          handlePress={handleGameButton}
        >
          <Avatar.Icon size={50} icon={"play"} />
          <Subheading>
            {user.currentGame ? "Resume Game" : "New Game"}
          </Subheading>
        </EmptyButton>
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
  },
  filler: {
    flexGrow: 1,
  },
  rowCenter: {
    display: "flex",
    flexDirection: "row",
  },
});
