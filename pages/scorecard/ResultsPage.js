import React, { useState, useEffect, Fragment } from "react";
import { ResultStatsHeader, ResultStats } from "../../components/PlayerStats";
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
      numAce: 0,
      numAlbatross: 0,
      numEagle: 0,
      numBirdie: 0,
      numPar: 0,
      numBogey: 0,
      numDoubleBogey: 0,
      numTripleBogey: 0,
      numShots: 0,
      numIdealPar: 0,
      numHoles: currentGame.numHoles,
      numDNF: 0,
    };
    let stats = {};
    currentGame.players.forEach((p) => {
      stats[p.id] = { ...playerStatsTemplate };
    });
    Object.keys(currentGame.playerScores).map((key) => {
      let scores = currentGame.playerScores[key];
      scores.forEach((value, index) => {
        const par = pars[index];
        if (value === 0) stats[key].numDNF++;
        else if (value === 1) stats[key].numAce++;
        else if (value === par - 3) stats[key].numAlbatross++;
        else if (value === par - 2) stats[key].numEagle++;
        else if (value === par - 1) stats[key].numBirdie++;
        else if (value === par) stats[key].numPar++;
        else if (value === par + 1) stats[key].numBogey++;
        else if (value === par + 2) stats[key].numDoubleBogey++;
        else if (value === par + 3) stats[key].numTripleBogey++;
        stats[key].numShots += value;
        stats[key].numIdealPar += par;
      });
    });
    setGameStats(stats);
    const updateUser = async () => {
      if (currentGame.firstPlaythrough)
        await currentGame.courseRef.update({
          par: stats[user.id].numIdealPar,
          firstPlaythrough: false,
        });
      await Promise.all(
        currentGame.players.map(async (p) => {
          let userStats = p.stats;
          userStats.numDNF += stats[p.id].numDNF;
          userStats.numAce += stats[p.id].numAce;
          userStats.numAlbatross += stats[p.id].numAlbatross;
          userStats.numEagle += stats[p.id].numEagle;
          userStats.numBirdie += stats[p.id].numBirdie;
          userStats.numPar += stats[p.id].numPar;
          userStats.numBogey += stats[p.id].numBogey;
          userStats.numDoubleBogey += stats[p.id].numDoubleBogey;
          userStats.numTripleBogey += stats[p.id].numTripleBogey;
          userStats.numShots += stats[p.id].numShots;
          userStats.numHoles += currentGame.numHoles;
          userStats.numGames++;
          await p.ref.update({
            stats: userStats,
          });
        })
      );
      await currentGame.scoreRef.update({
        statsRecorded: true,
      });
    };
    if (!currentGame.statsRecorded) {
      updateUser();
    } else setCurrentGame({ ...currentGame, loading: false });
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
            numDNF={gameStats[user.id].numDNF}
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
