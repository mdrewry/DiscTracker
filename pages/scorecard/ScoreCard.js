import React, { useState, useEffect, useRef, Fragment } from "react";
import { StyleSheet, View } from "react-native";
import { firestore } from "../../firebase";
import Page, { LoadingPage } from "../../components/Page";
import CustomCard from "../../components/CustomCard";
import CustomButton from "../../components/CustomButton";
import PageOne from "./PageOne";
import PageN from "./PageN";
import ResultsPage from "./ResultsPage";
export default function ScoreCard({ user, theme, navigation }) {
  const [page, setPage] = useState(0);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState({ id: "" });
  const [courseName, setCourseName] = useState("");
  const [courseNumHoles, setCourseNumHoles] = useState(18);
  const [courseMercyRule, setCourseMercyRule] = useState(5);
  const [enableNewCourseForm, setEnableNewCourseForm] = useState(false);
  const [currentGame, setCurrentGame] = useState(null);
  const [holeScore, setHoleScore] = useState(3);
  const [holePar, setHolePar] = useState(3);
  const [buttonText, setButtonText] = useState("Begin Game");
  const [headerText, setHeaderText] = useState("Create Game");
  const [loading, setLoading] = useState(user.currentGame !== "");
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const coursesRef = firestore
        .collection("courses")
        .where("usedBy", "array-contains", user.id);
      const coursesSnapshot = await coursesRef.get();
      if (coursesSnapshot.docs.length === 0) setEnableNewCourseForm(true);
      setCourses(
        coursesSnapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        })
      );
      setLoading(false);
    };
    getData();
    return () => getData();
  }, []);
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const scoreRef = firestore.collection("scores").doc(user.currentGame);
      const scoreDoc = await scoreRef.get();
      const scoreData = scoreDoc.data();
      const courseRef = firestore.collection("courses").doc(scoreData.courseID);
      const courseDoc = await courseRef.get();
      const courseData = courseDoc.data();
      setCurrentGame({
        ...scoreData,
        ...courseData,
        scoreRef,
        courseRef,
      });
      setHeaderText("Playing Game");
      if (scoreData.currentHole === courseData.numHoles - 1)
        setButtonText("End Game");
      else if (scoreData.currentHole === courseData.numHoles) {
        setButtonText("Exit to Dashboard");
        setHeaderText("Viewing Results");
      } else setButtonText("Next Hole");

      setPage(scoreData.currentHole + 1);
      setLoading(false);
    };
    if (user.currentGame !== "") {
      getData();
      return () => getData();
    } else {
      setPage(0);
      setButtonText("Begin Game");
    }
  }, [user.currentGame]);
  const handleCourseSelect = (index) => {
    setSelectedCourse(courses[index]);
  };
  const handleOldCourse = async () => {
    let playerScores = {};
    playerScores[user.id] = new Array(selectedCourse.numHoles).fill(0);
    await firestore
      .collection("scores")
      .add({
        courseID: selectedCourse.id,
        players: [user.id],
        playerScores: playerScores,
        currentHole: 0,
        statsRecorded: false,
      })
      .then(async (scoreRef) => {
        setCurrentGame();
        await user.ref.update({
          currentGame: scoreRef.id,
        });
      });
  };
  const handleNewCourse = async () => {
    await firestore
      .collection("courses")
      .add({
        courseName: courseName,
        numHoles: courseNumHoles,
        mercyRule: courseMercyRule,
        firstPlaythrough: true,
        usedBy: [user.id],
        holes: new Array(courseNumHoles).fill(3),
      })
      .then(async (docRef) => {
        let playerScores = {};
        playerScores[user.id] = new Array(courseNumHoles).fill(0);
        await firestore
          .collection("scores")
          .add({
            courseID: docRef.id,
            players: [user.id],
            playerScores: playerScores,
            currentHole: 0,
            statsRecorded: false,
          })
          .then(async (scoreRef) => {
            setCurrentGame();
            await user.ref.update({
              currentGame: scoreRef.id,
            });
          });
      });
    setCourseName("");
    setCourseMercyRule(5);
    setCourseNumHoles(18);
    setEnableNewCourseForm(false);
  };
  const handleScoreUpdate = async () => {
    if (currentGame.firstPlaythrough) {
      let holeValues = currentGame.holes;
      holeValues[page - 1] = holePar;
      await currentGame.courseRef.update({
        holes: holeValues,
      });
    }
    let currScores = currentGame.playerScores;
    currScores[user.id][page - 1] = holeScore;
    await currentGame.scoreRef.update({
      playerScores: currScores,
      currentHole: page,
    });
    await user.ref.update({
      currentGame: currentGame.scoreRef.id,
    });
  };
  const handleGameEnd = async () => {
    await currentGame.courseRef.update({
      firstPlaythrough: false,
    });
    await user.ref.update({
      currentGame: "",
    });
    setPage(0);
    setCurrentGame(null);
    navigation.navigate("Dashboard");
  };
  const handleNextPage = async () => {
    if (page === 0) {
      if (selectedCourse.id !== "") {
        await handleOldCourse();
        setButtonText("Next Hole");
        setPage((curr) => curr + 1);
      } else if (enableNewCourseForm && courseName !== "") {
        await handleNewCourse();
        setButtonText("Next Hole");
        setPage((curr) => curr + 1);
      }
    } else if (page > 0 && page <= currentGame.numHoles) {
      await handleScoreUpdate();
      setHolePar(
        currentGame.firstPlaythrough ? 3 : currentGame.holes[page - 1].par
      );
      if (page === currentGame.numHoles - 1) setButtonText("End Game");
      else if (page === currentGame.numHoles)
        setButtonText("Return to Dashboard");
      setHoleScore(3);
      setPage((curr) => curr + 1);
    } else {
      await handleGameEnd();
    }
  };
  if (loading) return <LoadingPage theme={theme} />;
  return (
    <Page title={headerText} navigation={navigation}>
      <Fragment>
        {page === 0 && (
          <PageOne
            courses={courses}
            selectedCourse={selectedCourse}
            handleCourseSelect={handleCourseSelect}
            courseName={courseName}
            setCourseName={setCourseName}
            courseNumHoles={courseNumHoles}
            setCourseNumHoles={setCourseNumHoles}
            courseMercyRule={courseMercyRule}
            setCourseMercyRule={setCourseMercyRule}
            enableNewCourseForm={enableNewCourseForm}
            setEnableNewCourseForm={setEnableNewCourseForm}
            theme={theme}
          />
        )}
        {page !== 0 && page <= currentGame.numHoles && (
          <Fragment>
            {currentGame.holes.map((hole, index) => (
              <PageN
                key={index}
                index={index}
                page={page}
                theme={theme}
                currentGame={currentGame}
                holeScore={holeScore}
                setHoleScore={setHoleScore}
                holePar={holePar}
                setHolePar={setHolePar}
              />
            ))}
          </Fragment>
        )}
        {page !== 0 && page === currentGame.numHoles + 1 && (
          <ResultsPage user={user} theme={theme} currentGame={currentGame} />
        )}
      </Fragment>
      <View style={styles.filler} />
      <CustomCard>
        <CustomButton text={buttonText} handlePress={handleNextPage} />
      </CustomCard>
    </Page>
  );
}

const styles = StyleSheet.create({
  titleWrapper: {
    marginLeft: 40,
  },
  text: {
    marginTop: 20,
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
