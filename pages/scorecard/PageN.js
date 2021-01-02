import React, { Fragment } from "react";
import { StyleSheet, View } from "react-native";
import { Title, Subheading } from "react-native-paper";
import CustomCard from "../../components/CustomCard";
import CustomSlider from "../../components/CustomSlider";
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
  if (page !== index + 1) {
    return <View />;
  }
  return (
    <Fragment>
      <CustomCard>
        <Title>Hole {page}</Title>
        <View style={styles.rowCenter}>
          <Subheading>{currentGame.courseName}</Subheading>
          <View style={styles.filler} />
          {!currentGame.firstPlaythrough && (
            <Subheading>Par {currentGame.holes[page - 1]}</Subheading>
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
          <CustomSlider
            theme={theme}
            value={holePar}
            setValue={setHolePar}
            minValue={1}
            maxValue={5}
            step={1}
          />
        </CustomCard>
      )}
      <CustomCard>
        <Title>Score</Title>
        <View style={styles.text} />
        <CustomSlider
          theme={theme}
          value={holeScore}
          setValue={setHoleScore}
          minValue={1}
          step={1}
          maxValue={currentGame.mercyRule}
        />
      </CustomCard>
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
