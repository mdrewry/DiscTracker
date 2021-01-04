import React, { Fragment } from "react";
import { StyleSheet, View } from "react-native";
import { Title, Subheading } from "react-native-paper";
import CustomCard from "../../components/CustomCard";
import { ButtonMenu, ButtonMenuGroup } from "../../components/CustomButton";
export default function PageN({
  page,
  index,
  theme,
  currentGame,
  holeScore,
  setHoleScore,
  holePar,
  setHolePar,
}) {
  if (page !== index) {
    return <View />;
  }
  return (
    <Fragment>
      <CustomCard>
        <Title>Hole {page + 1}</Title>
        <View style={styles.rowCenter}>
          <Subheading>{currentGame.courseName}</Subheading>
          <View style={styles.filler} />
          {!currentGame.firstPlaythrough && (
            <Subheading>Par {currentGame.holes[page]}</Subheading>
          )}
        </View>
      </CustomCard>
      {currentGame.firstPlaythrough && (
        <CustomCard>
          <View style={styles.rowCenter}>
            <Title>Par</Title>
            <View style={styles.filler} />
            <Subheading>(only first playthrough)</Subheading>
          </View>
          <View style={styles.text} />
          <ButtonMenu
            theme={theme}
            value={holePar}
            setValue={setHolePar}
            range={currentGame.mercyRule}
          />
        </CustomCard>
      )}
      {currentGame.players.map((player, key) => (
        <CustomCard key={key}>
          <Title>
            {player.name ? player.name : player.phoneNumber}'s Score
          </Title>
          <View style={styles.text} />
          <ButtonMenuGroup
            theme={theme}
            value={holeScore}
            setValue={setHoleScore}
            pos={player}
            range={currentGame.mercyRule}
          />
        </CustomCard>
      ))}
    </Fragment>
  );
}

const styles = StyleSheet.create({
  text: {
    marginTop: 5,
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
