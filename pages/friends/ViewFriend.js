import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Title, Subheading, Avatar } from "react-native-paper";
import CustomCard from "../../components/CustomCard";
import CustomButton from "../../components/CustomButton";
import CustomDialog from "../../components/CustomDialog";
import Page from "../../components/Page";
import { firestore, fieldValues } from "../../firebase";
import PlayerStats, { PlayerStatsHeader } from "../../components/PlayerStats";
export default function ViewFriend({ route, user, navigation, theme }) {
  const friend = route.params.friend;
  const [openRemoveFriend, setOpenRemoveFriend] = useState(false);
  const handleToggleRemoveFriend = () => {
    setOpenRemoveFriend((curr) => !curr);
  };
  const handleRemoveFriend = async () => {
    await firestore
      .collection("users")
      .doc(friend.id)
      .update({
        friends: fieldValues.arrayRemove(user.id),
      });
    await user.ref.update({
      friends: fieldValues.arrayRemove(friend.id),
    });
    navigation.navigate("Friends");
  };
  return (
    <Page
      navigation={navigation}
      theme={theme}
      user={user}
      title="Viewing Friend"
    >
      <CustomCard  theme={theme}>
        <View style={styles.rowCenter}>
          <Avatar.Image size={90} source={{ uri: friend.imageURL }} />
          <View style={styles.titleWrapper}>
            <Title>{friend.name ? friend.name : friend.phoneNumber}</Title>
            <Subheading>{friend.phoneNumber}</Subheading>
          </View>
        </View>
      </CustomCard>
      <PlayerStatsHeader stats={friend.stats} theme={theme} />
      <PlayerStats stats={friend.stats} theme={theme} />
      <CustomCard  theme={theme}>
        <CustomButton
          text="Remove Friend"
          handlePress={handleToggleRemoveFriend}
          disabled={false}
        />
        <CustomDialog
          visible={openRemoveFriend}
          setVisible={handleToggleRemoveFriend}
          type="Attention"
          prompt="You are about to remove this user from your friends list."
        >
          <CustomButton
            text="Cancel"
            handlePress={handleToggleRemoveFriend}
            disabled={false}
          />
          <View style={styles.buttonSpacer} />
          <CustomButton text="Confirm" handlePress={handleRemoveFriend} />
        </CustomDialog>
      </CustomCard>
    </Page>
  );
}

const styles = StyleSheet.create({
  titleWrapper: {
    marginLeft: 20,
  },
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
