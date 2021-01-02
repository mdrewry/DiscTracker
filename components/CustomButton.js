import * as React from "react";
import { TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
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
