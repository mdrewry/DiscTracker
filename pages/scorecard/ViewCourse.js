import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { Title, Text, Subheading } from "react-native-paper";
import CustomCard from "../../components/CustomCard";
import CustomField from "../../components/CustomField";
import CustomButton, { ButtonMenu } from "../../components/CustomButton";
import CustomDialog from "../../components/CustomDialog";
import Page from "../../components/Page";
import { firestore } from "../../firebase";
export default function ViewCourse({ route, user, navigation, theme }) {
  const course = route.params.course;
  const [name, setName] = useState(course.courseName);
  const [mercyRule, setMercyRule] = useState(course.mercyRule);
  const [save, setSave] = useState(false);
  const [openDeleteForm, setOpenDeleteForm] = useState(false);
  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) setSave(true);
    else didMountRef.current = true;
  }, [name, mercyRule]);
  const handleUpdateCourse = async () => {
    await firestore.collection("courses").doc(course.id).update({
      courseName: name,
      mercyRule: mercyRule,
    });
    navigation.navigate("ScoreCard");
  };
  const toggleDeleteCourse = () => {
    setOpenDeleteForm((curr) => !curr);
  };
  const handleDeleteCourse = async () => {
    const scoresSnapshot = await firestore
      .collection("scores")
      .where("courseID", "==", course.id)
      .get();
    await Promise.all(
      scoresSnapshot.docs.map(async (doc) => {
        await doc.ref.delete();
      })
    );
    await firestore.collection("courses").doc(course.id).delete();
    navigation.navigate("ScoreCard");
  };
  return (
    <Page
      navigation={navigation}
      theme={theme}
      user={user}
      title="Viewing Course"
    >
      <CustomCard>
        <Title>{course.courseName}</Title>
        <View style={styles.rowCenter}>
          <Subheading>{course.numHoles} Holes</Subheading>
          <View style={styles.filler} />
          <Subheading>Par {course.par}</Subheading>
        </View>
      </CustomCard>
      <CustomCard>
        <Title>Edit Course</Title>
        <Text style={styles.text}>Name</Text>
        <CustomField
          value={name}
          setValue={setName}
          placeholder="Markham Park"
          editable={true}
          autoFocus={false}
        />
        <Text style={styles.text}>Mercy Rule</Text>
        <ButtonMenu
          range={8}
          value={mercyRule}
          setValue={setMercyRule}
          theme={theme}
        />
      </CustomCard>
      <View style={styles.filler} />
      <CustomCard>
        <CustomButton
          text={save ? "Save" : "Saved!"}
          handlePress={handleUpdateCourse}
          disabled={!save}
        />
        <View style={styles.text} />
        <CustomButton text="Delete Course" handlePress={toggleDeleteCourse} />
        <CustomDialog
          visible={openDeleteForm}
          setVisible={toggleDeleteCourse}
          type="Attention"
          prompt="Deleting this course will also delete all scorecards assocated with it. This will not impact your overall stats."
        >
          <CustomButton
            text="Cancel"
            handlePress={toggleDeleteCourse}
            disabled={false}
          />
          <View style={styles.buttonSpacer} />
          <CustomButton text="Confirm" handlePress={handleDeleteCourse} />
        </CustomDialog>
      </CustomCard>
    </Page>
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
