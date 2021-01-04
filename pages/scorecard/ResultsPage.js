import React, { useState, useEffect, Fragment } from "react";
import { StyleSheet, View } from "react-native";
import { Title } from "react-native-paper";
import CustomCard from "../../components/CustomCard";
import StatObj, { StatHeader } from "../../components/StatObj";
export default function ResultsPage({
  user,
  currentGame,
  setCurrentGame,
  theme,
}) {
  const [gameStats, setGameStats] = useState(null);
  useEffect(() => {
    setCurrentGame({ ...currentGame, loading: true });
    const pars = currentGame.holes;
    let playerStatsTemplate = {
      ace: 0,
      albatross: 0,
      birdie: 0,
      par: 0,
      bogey: 0,
      doubleBogey: 0,
      eagle: 0,
      shots: 0,
      idealPar: 0,
    };
    let stats = {};
    currentGame.players.forEach((p) => {
      stats[p.id] = { ...playerStatsTemplate };
    });
    Object.keys(currentGame.playerScores).map((key) => {
      let scores = currentGame.playerScores[key];
      scores.forEach((value, index) => {
        const par = pars[index];
        if (value === 1) stats[key].ace++;
        else if (value === par - 3) stats[key].albatross++;
        else if (value === par - 2) stats[key].eagle++;
        else if (value === par - 1) stats[key].birdie++;
        else if (value === par) stats[key].par++;
        else if (value === par + 1) stats[key].bogey++;
        else if (value === par + 2) stats[key].doubleBogey++;
        stats[key].shots += value;
        stats[key].idealPar += par;
      });
    });
    setGameStats(stats);
    const updateUser = async () => {
      const scoreID = currentGame.scoreRef.id;
      if (currentGame.firstPlaythrough)
        await currentGame.courseRef.update({
          par: stats[user.id].idealPar,
          firstPlaythrough: false,
        });
      await currentGame.scoreRef.update({
        statsRecorded: true,
      });
      await Promise.all(
        currentGame.players.map(async (p) => {
          let userStats = p.stats;
          userStats.numAce += stats[p.id].ace;
          userStats.numAlbatross += stats[p.id].albatross;
          userStats.numEagle += stats[p.id].eagle;
          userStats.numBirdie += stats[p.id].birdie;
          userStats.numPar += stats[p.id].par;
          userStats.numBogey += stats[p.id].bogey;
          userStats.numDoubleBogey += stats[p.id].doubleBogey;
          userStats.numShots += stats[p.id].shots;
          userStats.numHoles += currentGame.numHoles;
          userStats.numGames++;
          await p.ref.update({
            stats: userStats,
          });
        })
      );
    };
    if (!currentGame.statsRecorded) {
      updateUser();
    }
    setCurrentGame({ ...currentGame, loading: false });
  }, []);
  const sortPlayerByScore = (a, b) => {
    return gameStats[a.id].shots - gameStats[b.id].shots;
  };
  return (
    <Fragment>
      {gameStats !== null && (
        <Fragment>
          <CustomCard>
            <StatHeader label="Overall" valueA="#" theme={theme} />
            <StatObj
              label="Holes"
              valueA={currentGame.numHoles}
              theme={theme}
            />
            <StatObj
              label="Par"
              valueA={gameStats[user.id].idealPar}
              theme={theme}
            />
          </CustomCard>
          {currentGame.players.sort(sortPlayerByScore).map((player, key) => (
            <CustomCard key={key}>
              <Title>
                #{key + 1} {player.name ? player.name : player.phoneNumber}
              </Title>
              <StatHeader
                label="Performance"
                valueA="#"
                valueB="%"
                theme={theme}
              />
              <StatObj
                label="Shots/Score"
                valueA={gameStats[player.id].shots}
                valueB={(
                  gameStats[player.id].shots / gameStats[player.id].idealPar
                ).toFixed(2)}
                theme={theme}
              />
              <StatObj
                label="Ace"
                valueA={gameStats[player.id].ace}
                valueB={(
                  gameStats[player.id].ace / currentGame.numHoles
                ).toFixed(2)}
                theme={theme}
              />
              <StatObj
                label="Albatross"
                valueA={gameStats[player.id].albatross}
                valueB={(
                  gameStats[player.id].albatross / currentGame.numHoles
                ).toFixed(2)}
                theme={theme}
              />
              <StatObj
                label="Eagle"
                valueA={gameStats[player.id].eagle}
                valueB={(
                  gameStats[player.id].eagle / currentGame.numHoles
                ).toFixed(2)}
                theme={theme}
              />
              <StatObj
                label="Birdie"
                valueA={gameStats[player.id].birdie}
                valueB={(
                  gameStats[player.id].birdie / currentGame.numHoles
                ).toFixed(2)}
                theme={theme}
              />
              <StatObj
                label="Par"
                valueA={gameStats[player.id].par}
                valueB={(
                  gameStats[player.id].par / currentGame.numHoles
                ).toFixed(2)}
                theme={theme}
              />
              <StatObj
                label="Bogey"
                valueA={gameStats[player.id].bogey}
                valueB={(
                  gameStats[player.id].bogey / currentGame.numHoles
                ).toFixed(2)}
                theme={theme}
              />
              <StatObj
                label="Double Bogey"
                valueA={gameStats[player.id].doubleBogey}
                valueB={(
                  gameStats[player.id].doubleBogey / currentGame.numHoles
                ).toFixed(2)}
                theme={theme}
              />
            </CustomCard>
          ))}
        </Fragment>
      )}
    </Fragment>
  );
}

const styles = StyleSheet.create({
  text: {
    marginTop: 20,
  },
  title: {
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
