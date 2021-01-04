import React from "react";
import { StyleSheet, View } from "react-native";
import { Title } from "react-native-paper";
import Page from "../../components/Page";
import CustomCard from "../../components/CustomCard";
import StatObj, { StatHeader } from "../../components/StatObj";
export default function Dashboard({ user, theme, navigation }) {
  const canDivide = user.stats.numGames > 0;
  return (
    <Page navigation={navigation} title="Dashboard" user={user} theme={theme}>
      <CustomCard>
        <StatHeader label="Overall" valueA="#" theme={theme} />
        <StatObj label="Games" valueA={user.stats.numGames} theme={theme} />
        <StatObj label="Holes" valueA={user.stats.numHoles} theme={theme} />
        <StatObj label="Shots" valueA={user.stats.numShots} theme={theme} />
      </CustomCard>
      <CustomCard>
        <StatHeader label="Performance" valueA="#" valueB="%" theme={theme} />
        <StatObj
          label="Ace"
          valueA={user.stats.numAce}
          valueB={
            canDivide
              ? (user.stats.numAce / user.stats.numHoles).toFixed(2)
              : "0.00"
          }
          theme={theme}
        />
        <StatObj
          label="Albatross"
          valueA={user.stats.numAlbatross}
          valueB={
            canDivide
              ? (user.stats.numAlbatross / user.stats.numHoles).toFixed(2)
              : "0.00"
          }
          total={user.stats.numHoles}
          theme={theme}
        />
        <StatObj
          label="Eagle"
          valueA={user.stats.numEagle}
          valueB={
            canDivide
              ? (user.stats.numEagle / user.stats.numHoles).toFixed(2)
              : "0.00"
          }
          theme={theme}
        />
        <StatObj
          label="Birdie"
          valueA={user.stats.numBirdie}
          valueB={
            canDivide
              ? (user.stats.numBirdie / user.stats.numHoles).toFixed(2)
              : "0.00"
          }
          theme={theme}
        />
        <StatObj
          label="Par"
          valueA={user.stats.numPar}
          valueB={
            canDivide
              ? (user.stats.numPar / user.stats.numHoles).toFixed(2)
              : "0.00"
          }
          theme={theme}
        />
        <StatObj
          label="Bogey"
          valueA={user.stats.numBogey}
          valueB={
            canDivide
              ? (user.stats.numBogey / user.stats.numHoles).toFixed(2)
              : "0.00"
          }
          theme={theme}
        />
        <StatObj
          label="Double Bogey"
          valueA={user.stats.numDoubleBogey}
          valueB={
            canDivide
              ? (user.stats.numDoubleBogey / user.stats.numHoles).toFixed(2)
              : "0.00"
          }
          theme={theme}
        />
      </CustomCard>
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
