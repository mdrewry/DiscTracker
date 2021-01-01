import * as React from "react";
import { TextInput } from "react-native-paper";
import { AsYouType, formatIncompletePhoneNumber } from "libphonenumber-js";
export default function CustomField({
  value,
  setValue,
  autoFocus,
  editable,
  placeholder,
}) {
  return (
    <TextInput
      theme={{ colors: { text: "black" } }}
      mode="outlined"
      placeholder={placeholder}
      editable={editable}
      autoFocus={autoFocus}
      value={value}
      onChangeText={setValue}
    />
  );
}
export const PhoneField = ({ value, setValue, editable, autoFocus }) => {
  const parseDigits = (string) => (string.match(/\d+/g) || []).join("");
  return (
    <TextInput
      theme={{ colors: { text: "black" } }}
      mode="outlined"
      placeholder="1 (999) 999-9999"
      autoFocus={autoFocus}
      editable={editable}
      autoCompleteType="tel"
      keyboardType="phone-pad"
      textContentType="telephoneNumber"
      value={value}
      onChangeText={(text) => {
        const digits = parseDigits(text);
        let formatted = new AsYouType("US").input(digits);
        if (formatted === value) {
          const newFormatted = formatIncompletePhoneNumber(formatted, "US");
          if (newFormatted.indexOf(text) === 0)
            formatted = formatted.slice(0, -1);
        }
        setValue(formatted);
      }}
    />
  );
};

export const CodeField = ({ setValue, autoFocus, editable }) => {
  return (
    <TextInput
      theme={{ colors: { text: "black" } }}
      mode="outlined"
      placeholder="123456"
      keyboardType="phone-pad"
      editable={editable}
      autoFocus={autoFocus}
      onChangeText={setValue}
    />
  );
};
