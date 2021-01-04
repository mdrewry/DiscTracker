import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Title } from "react-native-paper";
import Page from "../../components/Page";
import CustomCard from "../../components/CustomCard";
import { PhoneField } from "../../components/CustomField";
import CustomButton from "../../components/CustomButton";
import { firestore, Firebase, fieldValues } from "../../firebase";
import FriendObjAction, {
  FriendRequestObj,
  FriendRequestPending,
} from "./FriendObj";
export default function Friends({ user, theme, navigation }) {
  const [friendsList, setFriendsList] = useState([]);
  const [requested, setRequested] = useState([]);
  const [requests, setRequests] = useState([]);
  const [queryResult, setQueryResult] = useState(null);
  const [search, setSearch] = useState("");
  const disableSearch = !(search.replace(/[- )(]/g, "").length === 11);

  useEffect(() => {
    const unsubscribeRequests = firestore
      .collection("users")
      .where(
        Firebase.firestore.FieldPath.documentId(),
        "in",
        user.incomingFriendRequests
      )
      .onSnapshot((snapshot) => {
        setRequests(
          snapshot.docs.map((doc) => {
            return { ...doc.data(), id: doc.id, ref: doc.ref };
          })
        );
      });
    const unsubscribeRequested = firestore
      .collection("users")
      .where(
        Firebase.firestore.FieldPath.documentId(),
        "in",
        user.friendsRequested
      )
      .onSnapshot((snapshot) => {
        setRequested(
          snapshot.docs.map((doc) => {
            return { ...doc.data(), id: doc.id, ref: doc.ref };
          })
        );
      });
    const unsubscribeFriends = firestore
      .collection("users")
      .where(Firebase.firestore.FieldPath.documentId(), "in", user.friends)
      .onSnapshot((snapshot) => {
        setFriendsList(
          snapshot.docs.map((doc) => {
            return { ...doc.data(), id: doc.id, ref: doc.ref };
          })
        );
      });
    return () => {
      unsubscribeRequests();
      unsubscribeRequested();
      unsubscribeFriends();
    };
  }, [user]);
  const handleRequest = async (person) => {
    await person.ref.update({
      incomingFriendRequests: fieldValues.arrayUnion(user.id),
    });
    user.ref.update({
      friendsRequested: fieldValues.arrayUnion(person.id),
    });
    cancelRequest();
  };
  const cancelRequest = () => {
    setSearch("");
    setQueryResult(null);
  };
  const handleRejection = async (person) => {
    await user.ref.update({
      incomingFriendRequests: fieldValues.arrayRemove(person.id),
    });
    await person.ref.update({
      friendsRequested: fieldValues.arrayRemove(user.id),
    });
  };
  const handleFriendAccept = async (person) => {
    await user.ref.update({
      friends: fieldValues.arrayUnion(person.id),
      incomingFriendRequests: fieldValues.arrayRemove(person.id),
    });
    await person.ref.update({
      friends: fieldValues.arrayUnion(user.id),
      friendsRequested: fieldValues.arrayRemove(user.id),
    });
  };
  const handleSearch = async () => {
    const resultRef = firestore
      .collection("users")
      .where("phoneNumber", "==", "+" + search.replace(/[- )(]/g, ""));
    const resultDoc = await resultRef.get();
    const match = resultDoc.docs.map((doc) => {
      return { ...doc.data(), id: doc.id, ref: doc.ref };
    })[0];
    setQueryResult(match);
  };
  const handleViewProfile = () => {};
  return (
    <Page navigation={navigation} title="Social" user={user} theme={theme}>
      <CustomCard>
        <Title>Find Friends</Title>
        <PhoneField value={search} setValue={setSearch} />
        <View style={styles.spacer} />
        <CustomButton
          handlePress={handleSearch}
          disabled={disableSearch}
          text="Search"
        />
        <View style={styles.spacer} />
        {queryResult && (
          <FriendRequestObj
            friend={queryResult}
            theme={theme}
            handlePressA={cancelRequest}
            handlePressB={handleRequest}
            aText="Cancel"
            bText="Request"
          />
        )}
      </CustomCard>
      <CustomCard>
        <Title>Friends</Title>
        {friendsList.map((friend, index) => (
          <FriendObjAction
            key={index}
            friend={friend}
            theme={theme}
            handlePress={handleViewProfile}
            text="View Profile"
          />
        ))}
      </CustomCard>
      <CustomCard>
        <Title>Incoming Friend Requests</Title>
        {requests.map((friendRequest, index) => (
          <FriendRequestObj
            key={index}
            friend={friendRequest}
            theme={theme}
            handlePressA={handleRejection}
            handlePressB={handleFriendAccept}
            aText="Reject"
            bText="Accept"
          />
        ))}
      </CustomCard>
      <CustomCard>
        <Title>Pending</Title>
        {requested.map((friendRequest, key) => (
          <FriendRequestPending
            friend={friendRequest}
            theme={theme}
            index={key}
          />
        ))}
      </CustomCard>
    </Page>
  );
}

const styles = StyleSheet.create({
  surface: {
    elevation: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    padding: 20,
    borderRadius: 5,
  },
  spacer: {
    marginTop: 10,
  },
  title: {
    marginTop: 20,
  },
  filler: {
    flexGrow: 1,
  },
  rowCenter: {
    display: "flex",
    flexDirection: "row",
  },
});
