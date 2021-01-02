import * as React from "react";
import { Surface } from "react-native-paper";
export default function CustomSurface({ children, theme }) {
  return (
    <Surface
      style={{
        backgroundColor: theme.colors.accent,
        elevation: 8,
      }}
    >
      {children}
    </Surface>
  );
}
