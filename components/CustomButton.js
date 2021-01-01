import * as React from "react";
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
