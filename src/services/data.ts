import axios from "axios";

// Reading Questions

export async function getReadingQuestions(paramsId: any) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/readingQuestions/${paramsId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

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

export async function submitReadingQuestions(formData: any) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/readingQuestions`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // return response.data;
    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw error; // ← re‑throw or handle as needed
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

export async function submitWritingQuestions(formData: any) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/writingQuestions`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // return response.data;
    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw error; // ← re‑throw or handle as needed
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

export async function getSubmitReadingTest(testId: any, userId: any) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/submitAnswers/submitReadingAnswers/${testId}/${userId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

// Writing Submit Answers

export async function postSubmitWritingTest(formData: any) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/submitAnswers/submitWritingAnswers`,
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

export async function getSubmitWritingTest(testId: any, userId: any) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/submitAnswers/submitWritingAnswers/${testId}/${userId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

// Listening Questions
export async function getListeningTests() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/listeningQuestions`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getListeningTestById(id: string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/listeningQuestions/${id}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function submitListeningQuestions(formData: any) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/listeningQuestions`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // return response.data;
    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw error; // ← re‑throw or handle as needed
  }
}
