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

export async function getSingleReadingTest(paramsId: any) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/readingQuestions/${paramsId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// Writing Questions

export async function getWritingTest() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/writingQuestions/`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getSingleWritingTest(paramsId: any) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/writingQuestions/${paramsId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// Reading Submit Answers

export async function postSubmitReadingTest(formData: any) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/submitAnswers/submitReadingAnswers`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error; // ← re‑throw or handle as needed
  }
}

export async function getSubmitReadingTest(testId: any) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/submitAnswers/submitReadingAnswers/${testId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
