import * as React from "react";
import { StyleSheet, View } from "react-native";
import Slider from "react-native-slider";
import { Text, Surface } from "react-native-paper";
export default function CustomSlider({
  minValue,
  maxValue,
  step,
  value,
  setValue,
  theme,
}) {
  return (
    <View style={styles.sliderWrapper}>
      <Slider
        style={{
          ...styles.slider,
        }}
        thumbTintColor={theme.colors.accent}
        thumbTouchSize={{ width: 100, height: 50 }}
        maximumTrackTintColor={theme.colors.accent}
        minimumTrackTintColor={theme.colors.accent}
        minimumValue={minValue}
        maximumValue={maxValue}
        step={step}
        value={value}
        onValueChange={(value) => {
          setValue(value);
        }}
      />
      <Surface
        style={{ ...styles.surface, backgroundColor: theme.colors.accent }}
      >
        <Text>{value}</Text>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  slider: { flex: 1 },
  sliderWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  surface: {
    elevation: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    marginRight: 10,
    width: 30,
    height: 30,
    borderRadius: 10,
  },
});
