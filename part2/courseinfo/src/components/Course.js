import Content from "./Content";
import Header from "./Header";
import Total from "./Total";

const getSumOfExercises = (parts) => {
  return parts.reduce((sum, part) => {
    console.log("What is happening", sum, part)
    return sum + part.exercises;
  }, 0);
};

const Course = ({ course }) => {
  return (
    <>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total sum={getSumOfExercises(course.parts)} />
    </>
  );
};

export default Course;
