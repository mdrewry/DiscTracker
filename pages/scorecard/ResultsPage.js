import React, { useState, useEffect, Fragment } from "react";
import { StyleSheet, View } from "react-native";
import { Title, Text, Subheading } from "react-native-paper";
import CustomCard from "../../components/CustomCard";
export default function ResultsPage({ user, currentGame }) {
  const [gameStats, setGameStats] = useState(null);
  useEffect(() => {
    const pars = currentGame.holes;
    const scores = currentGame.playerScores[user.id];
    let stats = {
      ace: 0,
      albatross: 0,
      birdie: 0,
      par: 0,
      bogey: 0,
      doubleBogey: 0,
      eagle: 0,
      shots: 0,
      holes: currentGame.numHoles,
    };
    scores.forEach((value, index) => {
      const par = pars[index];
      if (value === 1) stats.ace++;
      else if (value === par - 3) stats.albatross++;
      else if (value === par - 2) stats.eagle++;
      else if (value === par - 1) stats.birdie++;
      else if (value === par) stats.par++;
      else if (value === par + 1) stats.bogey++;
      else if (value === par + 2) stats.doubleBogey++;
      stats.shots += value;
    });
    setGameStats(stats);
    let userStats = user.stats;
    userStats.numAce += stats.ace;
    userStats.numAlbatross += stats.albatross;
    userStats.numEagle += stats.eagle;
    userStats.numBirdie += stats.birdie;
    userStats.numPar += stats.par;
    userStats.numBogey += stats.bogey;
    userStats.numDoubleBogey += stats.doubleBogey;
    userStats.numShots += stats.shots;
    userStats.numHoles += stats.holes;
    userStats.numGames++;

    const updateUser = async () => {
      await user.ref.update({ stats: userStats });
      await currentGame.scoreRef.update({
        statsRecorded: true,
      });
    };
    if (!currentGame.statsRecorded) {
      updateUser();
      return () => updateUser();
    }
  }, []);
  return (
    <Fragment>
      <CustomCard>
        <Title>Course Complete</Title>
      </CustomCard>
      {gameStats !== null && (
        <CustomCard>
          <Title>Summary & Performance</Title>
          <View>
            <Subheading>Overall</Subheading>
            <View style={styles.rowCenter}>
              <Text># Holes</Text>
              <View style={styles.filler} />
              <Text>{gameStats.holes}</Text>
            </View>
            <View style={styles.rowCenter}>
              <Text># Shots</Text>
              <View style={styles.filler} />
              <Text>{gameStats.shots}</Text>
            </View>
          </View>
          <View>
            <Subheading>Performance</Subheading>
            <View style={styles.rowCenter}>
              <Text># Ace</Text>
              <View style={styles.filler} />
              <Text>{gameStats.ace}</Text>
            </View>
            <View style={styles.rowCenter}>
              <Text># Albatross</Text>
              <View style={styles.filler} />
              <Text>{gameStats.albatross}</Text>
            </View>
            <View style={styles.rowCenter}>
              <Text># Eagle</Text>
              <View style={styles.filler} />
              <Text>{gameStats.eagle}</Text>
            </View>
            <View style={styles.rowCenter}>
              <Text># Birdie</Text>
              <View style={styles.filler} />
              <Text>{gameStats.birdie}</Text>
            </View>
            <View style={styles.rowCenter}>
              <Text># Par</Text>
              <View style={styles.filler} />
              <Text>{gameStats.par}</Text>
            </View>
            <View style={styles.rowCenter}>
              <Text># Bogey</Text>
              <View style={styles.filler} />
              <Text>{gameStats.bogey}</Text>
            </View>
            <View style={styles.rowCenter}>
              <Text># Double Bogey</Text>
              <View style={styles.filler} />
              <Text>{gameStats.doubleBogey}</Text>
            </View>
          </View>
        </CustomCard>
      )}
    </Fragment>
  );
}

const styles = StyleSheet.create({
  text: {
    marginTop: 20,
  },
  middleText: {
    marginTop: 10,
    marginBottom: 10,
    alignSelf: "center",
  },
  filler: {
    flexGrow: 1,
  },
  rowCenter: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  buttonSpacer: {
    width: 20,
  },
});
