import React from "react";
import { StyleSheet, View } from "react-native";
import { Title, Avatar } from "react-native-paper";
import CustomCard from "../../components/CustomCard";
import CustomButton, {
  SelectionButtonDefault,
} from "../../components/CustomButton";

export default function FriendObjAction({ friend, theme, handlePress, text }) {
  return (
    <CustomCard theme={theme}>
      <View style={styles.rowCenter}>
        <Avatar.Image size={50} source={{ uri: friend.imageURL }} />
        <Title style={{ ...styles.textSpacer }}>
          {friend.name ? friend.name : friend.phoneNumber}
        </Title>
      </View>
      <View style={styles.rowCenter}>
        <View style={styles.filler} />
        <SelectionButtonDefault
          text={text}
          handlePress={handlePress}
          index={friend}
        />
      </View>
    </CustomCard>
  );
}

export const FriendRequestObj = ({
  friend,
  theme,
  handlePressA,
  handlePressB,
  aText,
  bText,
}) => {
  return (
    <CustomCard theme={theme}>
      <View style={styles.rowCenter}>
        <Avatar.Image size={50} source={{ uri: friend.imageURL }} />
        <Title style={{ ...styles.textSpacer }}>
          {friend.name ? friend.name : friend.phoneNumber}
        </Title>
      </View>
      <View style={styles.spacer} />
      <View style={styles.rowCenter}>
        <View style={styles.filler} />
        <SelectionButtonDefault
          text={aText}
          handlePress={handlePressA}
          index={friend}
        />
        <View style={styles.textSpacer} />
        <SelectionButtonDefault
          text={bText}
          handlePress={handlePressB}
          index={friend}
        />
      </View>
    </CustomCard>
  );
};
export const FriendRequestPending = ({ friend, theme }) => {
  return (
    <CustomCard theme={theme}>
      <View style={styles.rowCenter}>
        <Avatar.Image size={50} source={{ uri: friend.imageURL }} />
        <Title style={{ ...styles.textSpacer }}>{friend.name}</Title>
      </View>
      <View style={styles.spacer} />
      <View style={styles.rowCenter}>
        <View style={styles.filler} />
        <CustomButton text="Requested" disabled={true} handlePress={() => {}} />
      </View>
    </CustomCard>
  );
};

const styles = StyleSheet.create({
  filler: {
    flexGrow: 1,
  },
  textSpacer: {
    marginLeft: 20,
  },
  spacer: {
    marginTop: 10,
  },
  rowCenter: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});
