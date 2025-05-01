import axios from "axios";

// Reading Questions

export async function getReadingTest() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/readingQuestions/`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getSingleReadingTest(paramsId) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/readingQuestions/${paramsId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// Reading Submitting Answers

export async function getSubmitReadingTest(testId) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/submitAnswers/submitReadingAnswers/${testId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
