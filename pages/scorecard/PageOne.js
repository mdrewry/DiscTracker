import React, { Fragment } from "react";
import { StyleSheet, View } from "react-native";
import { Title, Text, Subheading } from "react-native-paper";
import CustomCard from "../../components/CustomCard";
import CustomField from "../../components/CustomField";
import CustomButton, { SelectionButton } from "../../components/CustomButton";
import CustomSlider from "../../components/CustomSlider";
export default function PageOne({
  courses,
  selectedCourse,
  handleCourseSelect,
  courseName,
  setCourseName,
  courseNumHoles,
  setCourseNumHoles,
  courseMercyRule,
  setCourseMercyRule,
  enableNewCourseForm,
  setEnableNewCourseForm,
  theme,
}) {
  return (
    <Fragment>
      <CustomCard>
        <Title>1) Select A Course</Title>
        <View style={styles.text} />
        {courses.length > 0 && (
          <Fragment>
            <CustomButton
              icon="flag"
              text="Previous Course"
              handlePress={() => {
                setEnableNewCourseForm(false);
              }}
            />
            <Text style={styles.middleText}> OR </Text>
          </Fragment>
        )}
        <CustomButton
          icon="flag-plus"
          text="New Course"
          handlePress={() => {
            setEnableNewCourseForm(true);
          }}
        />
      </CustomCard>
      {enableNewCourseForm ? (
        <CustomCard>
          <Title>Create Course</Title>
          <Text style={styles.text}>Name</Text>
          <CustomField
            value={courseName}
            setValue={setCourseName}
            placeholder="Markham Park"
            editable={true}
            autoFocus={false}
          />
          <Text style={styles.text}># Of Holes</Text>
          <CustomSlider
            value={courseNumHoles}
            setValue={setCourseNumHoles}
            step={1}
            minValue={1}
            maxValue={36}
            theme={theme}
          />
          <Text style={styles.text}>Mercy Rule</Text>
          <CustomSlider
            value={courseMercyRule}
            setValue={setCourseMercyRule}
            step={1}
            minValue={1}
            maxValue={8}
            theme={theme}
          />
        </CustomCard>
      ) : (
        <CustomCard>
          <Title>Previous Courses</Title>
          {courses.map((course, index) => (
            <SelectionButton
              key={index}
              style={{
                backgroundColor: `${
                  course.id === selectedCourse.id
                    ? theme.colors.accent
                    : theme.colors.primary
                }`,
                ...styles.surface,
              }}
              handlePress={handleCourseSelect}
              index={index}
            >
              <Title>{course.courseName} </Title>
              <Subheading>{course.numHoles} Holes</Subheading>
            </SelectionButton>
          ))}
        </CustomCard>
      )}
    </Fragment>
  );
}

const styles = StyleSheet.create({
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
  surface: {
    elevation: 8,
    display: "flex",
    marginTop: 20,
    padding: 20,
    borderRadius: 5,
  },
});
