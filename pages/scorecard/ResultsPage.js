import React, { useState, useEffect, Fragment } from "react";
import { StyleSheet, View } from "react-native";
import CustomCard from "../../components/CustomCard";
import StatObj, { StatHeader } from "../../components/StatObj";
export default function ResultsPage({ user, currentGame, theme }) {
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
      idealPar: 0,
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
      stats.idealPar += par;
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
      if (currentGame.firstPlaythrough)
        await currentGame.courseRef.update({ par: stats.idealPar });
      await currentGame.scoreRef.update({
        statsRecorded: true,
      });
      await user.ref.update({
        stats: userStats,
        currentGame: currentGame.scoreRef.id,
      });
    };
    if (!currentGame.statsRecorded) {
      updateUser();
      return () => updateUser();
    }
  }, []);
  return (
    <Fragment>
      {gameStats !== null && (
        <Fragment>
          <CustomCard>
            <StatHeader label="Overall" valueA="#" theme={theme} />
            <StatObj label="Holes" valueA={gameStats.holes} theme={theme} />
            <StatObj label="Par" valueA={gameStats.idealPar} theme={theme} />
            <StatObj label="Shots" valueA={gameStats.shots} theme={theme} />
          </CustomCard>
          <CustomCard>
            <StatHeader
              label="Performance"
              valueA="#"
              valueB="%"
              theme={theme}
            />
            <StatObj
              label="Ace"
              valueA={gameStats.ace}
              valueB={(gameStats.ace / gameStats.holes).toFixed(2)}
              theme={theme}
            />
            <StatObj
              label="Albatross"
              valueA={gameStats.albatross}
              valueB={(gameStats.albatross / gameStats.holes).toFixed(2)}
              total={gameStats.holes}
              theme={theme}
            />
            <StatObj
              label="Eagle"
              valueA={gameStats.eagle}
              valueB={(gameStats.eagle / gameStats.holes).toFixed(2)}
              theme={theme}
            />
            <StatObj
              label="Birdie"
              valueA={gameStats.birdie}
              valueB={(gameStats.birdie / gameStats.holes).toFixed(2)}
              theme={theme}
            />
            <StatObj
              label="Par"
              valueA={gameStats.par}
              valueB={(gameStats.par / gameStats.holes).toFixed(2)}
              theme={theme}
            />
            <StatObj
              label="Bogey"
              valueA={gameStats.bogey}
              valueB={(gameStats.bogey / gameStats.holes).toFixed(2)}
              theme={theme}
            />
            <StatObj
              label="Double Bogey"
              valueA={gameStats.doubleBogey}
              valueB={(gameStats.doubleBogey / gameStats.holes).toFixed(2)}
              theme={theme}
            />
          </CustomCard>
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
