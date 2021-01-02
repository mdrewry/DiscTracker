import * as React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
export default function CustomButton({ handlePress, text, icon, disabled }) {
  return (
    <Button
      theme={{ colors: { primary: "white" } }}
      icon={icon}
      mode="outlined"
      disabled={disabled}
      onPress={handlePress}
    >
      {text}
    </Button>
  );
}
export const SelectionButtonDefault = ({
  handlePress,
  disabled,
  index,
  icon,
  text,
}) => {
  return (
    <Button
      icon={icon}
      mode="outlined"
      disabled={disabled}
      onPress={() => handlePress(index)}
    >
      {text}
    </Button>
  );
};
export const EmptyButton = ({ handlePress, disabled, children, style }) => {
  return (
    <TouchableOpacity onPress={handlePress} disabled={disabled} style={style}>
      {children}
    </TouchableOpacity>
  );
};

export const SelectionButton = ({
  handlePress,
  disabled,
  children,
  style,
  index,
}) => {
  return (
    <TouchableOpacity
      onPress={() => handlePress(index)}
      disabled={disabled}
      style={style}
    >
      {children}
    </TouchableOpacity>
  );
};

export const ButtonMenu = ({ value, setValue, range, theme }) => {
  const arr = new Array(range).fill(0);
  const handlePress = (index) => {
    setValue(index);
  };
  return (
    <View style={styles.buttonMenu}>
      {arr.map((val, index) => (
        <SelectionButton
          handlePress={handlePress}
          index={index + 1}
          disabled={value - 1 === index}
          style={{
            ...styles.buttonStyle,
            backgroundColor:
              value - 1 !== index ? theme.colors.accent : theme.colors.primary,
          }}
        >
          <Text>{index + 1}</Text>
        </SelectionButton>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonMenu: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },
  buttonStyle: {
    width: 35,
    height: 35,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
