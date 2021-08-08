import React, { useState, useEffect, Fragment } from "react";
import { StyleSheet, View } from "react-native";
import { firestore, Firebase } from "../../firebase";
import Page, { LoadingPage } from "../../components/Page";
import CustomDialog from "../../components/CustomDialog";
import CustomCard from "../../components/CustomCard";
import CustomButton from "../../components/CustomButton";
import CreateGame from "./CreateGame";
import PageN from "./PageN";
import ResultsPage from "./ResultsPage";
export default function ScoreCard({ user, theme, navigation }) {
  const [page, setPage] = useState(0);
  const [courses, setCourses] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState({ id: "" });
  const [courseName, setCourseName] = useState("");
  const [courseNumHoles, setCourseNumHoles] = useState(18);
  const [courseMercyRule, setCourseMercyRule] = useState(5);
  const [enableNewCourseForm, setEnableNewCourseForm] = useState(false);
  const [currentGame, setCurrentGame] = useState({
    loading: true,
    gameInProgress: false,
  });
  const [holeScore, setHoleScore] = useState({});
  const [holePar, setHolePar] = useState(3);
  const [buttonText, setButtonText] = useState("Begin Game");
  const [headerText, setHeaderText] = useState("Create Game");
  const [dialogVisible, setDialogVisible] = useState(false);
  useEffect(() => {
    const getData = async () => {
      if (user.currentGame === "") {
        const coursesRef = firestore
          .collection("courses")
          .where("usedBy", "array-contains", user.id);
        const unsubscribeCourses = coursesRef.onSnapshot((snapshot) => {
          if (snapshot.docs.length === 0) setEnableNewCourseForm(true);
          setCourses(
            snapshot.docs.map((doc) => {
              return { ...doc.data(), id: doc.id };
            })
          );
        });
        setPage(0);
        setButtonText("Begin Game");
        setCurrentGame({ loading: false, gameInProgress: false });
        return () => unsubscribeCourses();
      } else {
        const scoreRef = firestore.collection("scores").doc(user.currentGame);
        const unsubscribeScore = scoreRef.onSnapshot(async (doc) => {
          const scoreData = doc.data();
          const courseRef = firestore
            .collection("courses")
            .doc(scoreData.courseID);
          const courseData = (await courseRef.get()).data();
          let scoreSheet = {};
          const players = (
            await firestore
              .collection("users")
              .where(
                Firebase.firestore.FieldPath.documentId(),
                "in",
                scoreData.players
              )
              .get()
          ).docs.map((doc) => {
            scoreSheet[doc.id] = courseData.holes[scoreData.currentHole];
            return { ...doc.data(), id: doc.id, ref: doc.ref };
          });
          const currentGame = {
            ...scoreData,
            ...courseData,
            scoreRef: doc.ref,
            courseRef,
            players: players,
            loading: false,
            gameInProgress: true,
          };
          setHoleScore(scoreSheet);
          setPage(currentGame.currentHole);
          setHeaderText("Playing Game");
          setButtonText("Next Hole");
          if (currentGame.currentHole < currentGame.numHoles)
            setHolePar(
              currentGame.firstPlaythrough ? 3 : currentGame.holes[page].par
            );
          if (currentGame.currentHole === currentGame.numHoles - 1)
            setButtonText("End Game");
          else if (currentGame.currentHole === currentGame.numHoles) {
            setHeaderText("Viewing Results");
            setButtonText("Exit to Dashboard");
          }
          setCurrentGame(currentGame);
        });
        return () => unsubscribeScore();
      }
    };
    getData();
  }, [user.currentGame]);
  const handleCourseSelect = (index) => {
    setSelectedCourse(courses[index]);
  };
  const handleEndDialogToggle = () => {
    setDialogVisible((curr) => !curr);
  };
  const handleFriendSelect = async (player) => {
    const index = players.findIndex((p) => p.id === player.id);
    if (index !== -1) {
      let playersTemp = players;
      playersTemp.splice(index, 1);
      setPlayers([...playersTemp]);
    } else setPlayers([...players, player]);
  };
  const updatePlayersOnStart = async (scoreID) => {
    await Promise.all(
      players.map(async (p) => {
        await p.ref.update({
          currentGame: scoreID,
        });
      })
    );
    await user.ref.update({
      currentGame: scoreID,
    });
  };
  const createScoreDocument = async (docID, numberHoles) => {
    let playerScores = {};
    const initialScores = new Array(numberHoles).fill(0);
    playerScores[user.id] = initialScores;
    players.forEach((p) => (playerScores[p.id] = initialScores));
    await firestore
      .collection("scores")
      .add({
        courseID: docID,
        players: [user.id, ...players.map((p) => p.id)],
        playerScores: playerScores,
        currentHole: 0,
        statsRecorded: false,
      })
      .then((scoreRef) => {
        updatePlayersOnStart(scoreRef.id);
      });
  };
  const handleOldCourse = async () => {
    await createScoreDocument(selectedCourse.id, selectedCourse.numHoles);
    setSelectedCourse({ id: "" });
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
        await createScoreDocument(docRef.id, courseNumHoles);
      });
    setCourseName("");
    setCourseMercyRule(5);
    setCourseNumHoles(18);
    setEnableNewCourseForm(false);
  };
  const handleScoreUpdate = async () => {
    if (currentGame.firstPlaythrough) {
      let holeValues = currentGame.holes;
      holeValues[page] = holePar;
      await currentGame.courseRef.update({
        holes: holeValues,
      });
    }
    let currScores = currentGame.playerScores;
    currentGame.players.forEach((p) => {
      currScores[p.id][page] = holeScore[p.id];
    });
    await currentGame.scoreRef.update({
      playerScores: currScores,
      currentHole: page + 1,
    });
  };
  const updateDNFScores = async () => {
    if (currentGame.firstPlaythrough) {
      let holeValues = currentGame.holes;
      holeValues[page] = holePar;
      for (let i = page + 1; i < currentGame.numHoles; i++) holeValues[i] = 3;
      await currentGame.courseRef.update({
        holes: holeValues,
      });
    }
    await currentGame.scoreRef.update({
      currentHole: currentGame.numHoles,
    });
  };
  const handleGameEnd = async () => {
    navigation.navigate("Dashboard");
    await Promise.all(
      currentGame.players.map(async (p) => {
        await p.ref.update({
          currentGame: "",
        });
      })
    );
  };
  const handleGameEndEarly = async () => {
    setCurrentGame({ ...currentGame, loading: true, gameInProgress: false });
    handleEndDialogToggle();
    await updateDNFScores();
  };
  const handleNextPage = async () => {
    if (!currentGame.gameInProgress) {
      if (selectedCourse.id !== "") {
        setCurrentGame({ loading: true, gameInProgress: false });
        await handleOldCourse();
      } else if (enableNewCourseForm && courseName !== "") {
        setCurrentGame({ loading: true, gameInProgress: false });
        await handleNewCourse();
      }
    } else if (page < currentGame.numHoles) {
      setCurrentGame({ ...currentGame, loading: true, gameInProgress: false });
      await handleScoreUpdate();
    } else {
      setCurrentGame({ loading: true, gameInProgress: false });
      await handleGameEnd();
    }
  };
  if (currentGame.loading) return <LoadingPage theme={theme} />;
  return (
    <Page title={headerText} navigation={navigation} user={user} theme={theme}>
      <CustomDialog
        visible={dialogVisible}
        setVisible={handleEndDialogToggle}
        type="Attention"
        prompt="You are about to end the game early."
      >
        <CustomButton text="Cancel" handlePress={handleEndDialogToggle} />
        <View style={styles.buttonSpacer} />
        <CustomButton text="Confirm" handlePress={handleGameEndEarly} />
      </CustomDialog>
      <Fragment>
        {!currentGame.gameInProgress ? (
          <CreateGame
            user={user}
            courses={courses}
            selectedCourse={selectedCourse}
            handleCourseSelect={handleCourseSelect}
            handleFriendSelect={handleFriendSelect}
            players={players}
            courseName={courseName}
            setCourseName={setCourseName}
            courseNumHoles={courseNumHoles}
            setCourseNumHoles={setCourseNumHoles}
            courseMercyRule={courseMercyRule}
            setCourseMercyRule={setCourseMercyRule}
            enableNewCourseForm={enableNewCourseForm}
            setEnableNewCourseForm={setEnableNewCourseForm}
            theme={theme}
            navigation={navigation}
          />
        ) : (
          <Fragment>
            {page < currentGame.numHoles ? (
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
            ) : (
              <ResultsPage
                user={user}
                theme={theme}
                currentGame={currentGame}
                setCurrentGame={setCurrentGame}
              />
            )}
          </Fragment>
        )}
      </Fragment>
      <View style={styles.filler} />
      <CustomCard style={styles.rowCenter} theme={theme}>
        {page < currentGame.numHoles - 1 && (
          <CustomButton text="End" handlePress={handleEndDialogToggle} />
        )}
        <CustomButton
          style={{ flexGrow: 1, marginLeft: 10 }}
          text={buttonText}
          handlePress={handleNextPage}
        />
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
  nextButton: {},
});
