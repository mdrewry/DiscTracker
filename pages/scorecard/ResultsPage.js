import React, { useState, useEffect, Fragment } from "react";
import { StyleSheet, View } from "react-native";
import { Title } from "react-native-paper";
import CustomCard from "../../components/CustomCard";
import StatObj, { StatHeader } from "../../components/StatObj";
import { ResultStatsHeader, ResultStats } from "../../components/PlayerStats";
export default function ResultsPage({
  user,
  currentGame,
  setCurrentGame,
  theme,
}) {
  const [gameStats, setGameStats] = useState(null);
  useEffect(() => {
    const pars = currentGame.holes;
    let playerStatsTemplate = {
      numAce: 0,
      numAlbatross: 0,
      numBirdie: 0,
      numPar: 0,
      numBogey: 0,
      numDoubleBogey: 0,
      numEagle: 0,
      numShots: 0,
      numIdealPar: 0,
      numHoles: currentGame.numHoles,
    };
    let stats = {};
    currentGame.players.forEach((p) => {
      stats[p.id] = { ...playerStatsTemplate };
    });
    Object.keys(currentGame.playerScores).map((key) => {
      let scores = currentGame.playerScores[key];
      scores.forEach((value, index) => {
        const par = pars[index];
        if (value === 1) stats[key].numAce++;
        else if (value === par - 3) stats[key].numAlbatross++;
        else if (value === par - 2) stats[key].numEagle++;
        else if (value === par - 1) stats[key].numBirdie++;
        else if (value === par) stats[key].numPar++;
        else if (value === par + 1) stats[key].numBogey++;
        else if (value === par + 2) stats[key].numDoubleBogey++;
        stats[key].numShots += value;
        stats[key].numIdealPar += par;
      });
    });
    setGameStats(stats);
    const updateUser = async () => {
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
    return gameStats[a.id].numShots - gameStats[b.id].numShots;
  };
  return (
    <Fragment>
      {gameStats && (
        <Fragment>
          <ResultStatsHeader
            theme={theme}
            numHoles={currentGame.numHoles}
            numIdealPar={gameStats[user.id].numIdealPar}
          />
          {currentGame.players.sort(sortPlayerByScore).map((player, key) => (
            <ResultStats
              pos={key + 1}
              player={player}
              theme={theme}
              stats={gameStats[player.id]}
            />
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
