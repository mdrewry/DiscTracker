import React, { Fragment } from "react";
import { Title } from "react-native-paper";
import CustomCard from "./CustomCard";
import StatObj, { StatHeader } from "./StatObj";

export const StandardStats = ({ stats, theme, canDivide }) => {
  return (
    <Fragment>
      <StatObj
        label="Ace"
        valueA={stats.numAce}
        valueB={canDivide ? (stats.numAce / stats.numHoles).toFixed(2) : "0.00"}
        theme={theme}
      />
      <StatObj
        label="Albatross"
        valueA={stats.numAlbatross}
        valueB={
          canDivide ? (stats.numAlbatross / stats.numHoles).toFixed(2) : "0.00"
        }
        total={stats.numHoles}
        theme={theme}
      />
      <StatObj
        label="Eagle"
        valueA={stats.numEagle}
        valueB={
          canDivide ? (stats.numEagle / stats.numHoles).toFixed(2) : "0.00"
        }
        theme={theme}
      />
      <StatObj
        label="Birdie"
        valueA={stats.numBirdie}
        valueB={
          canDivide ? (stats.numBirdie / stats.numHoles).toFixed(2) : "0.00"
        }
        theme={theme}
      />
      <StatObj
        label="Par"
        valueA={stats.numPar}
        valueB={canDivide ? (stats.numPar / stats.numHoles).toFixed(2) : "0.00"}
        theme={theme}
      />
      <StatObj
        label="Bogey"
        valueA={stats.numBogey}
        valueB={
          canDivide ? (stats.numBogey / stats.numHoles).toFixed(2) : "0.00"
        }
        theme={theme}
      />
      <StatObj
        label="Double Bogey"
        valueA={stats.numDoubleBogey}
        valueB={
          canDivide
            ? (stats.numDoubleBogey / stats.numHoles).toFixed(2)
            : "0.00"
        }
        theme={theme}
      />
      <StatObj
        label="Triple Bogey"
        valueA={stats.numTripleBogey}
        valueB={
          canDivide
            ? (stats.numTripleBogey / stats.numHoles).toFixed(2)
            : "0.00"
        }
        theme={theme}
      />
    </Fragment>
  );
};
export default function PlayerStats({ stats, theme }) {
  const canDivide = stats.numGames > 0;
  return (
    <CustomCard>
      <StatHeader label="Performance" valueA="#" valueB="%" theme={theme} />
      <StandardStats canDivide={canDivide} theme={theme} stats={stats} />
    </CustomCard>
  );
}

export const PlayerStatsHeader = ({ stats, theme }) => {
  return (
    <CustomCard>
      <StatHeader label="Overall" valueA="#" theme={theme} />
      <StatObj label="Games" valueA={stats.numGames} theme={theme} />
      <StatObj label="Holes" valueA={stats.numHoles} theme={theme} />
      <StatObj label="Shots" valueA={stats.numShots} theme={theme} />
    </CustomCard>
  );
};

export const ResultStatsHeader = ({ numHoles, numIdealPar, theme }) => {
  return (
    <CustomCard>
      <StatHeader label="Overall" valueA="#" theme={theme} />
      <StatObj label="Holes" valueA={numHoles} theme={theme} />
      <StatObj label="Par" valueA={numIdealPar} theme={theme} />
    </CustomCard>
  );
};
export const ResultStats = ({ player, pos, theme, stats }) => {
  return (
    <CustomCard>
      <Title>
        #{pos} {player.name ? player.name : player.phoneNumber}
      </Title>
      <StatHeader label="Performance" valueA="#" valueB="%" theme={theme} />
      <StatObj
        label="Shots/Score"
        valueA={stats.numShots}
        valueB={(stats.numShots / stats.numIdealPar).toFixed(2)}
        theme={theme}
      />
      <StandardStats theme={theme} stats={stats} canDivide={true} />
    </CustomCard>
  );
};
