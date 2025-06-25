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

export async function deleteReadingTest(paramsId: any) {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/readingQuestions/${paramsId}`
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
    console.log("Fetching writing test submission:", { testId, userId });
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/submitAnswers/submitWritingAnswers/${testId}/${userId}`
    );
    console.log("Writing test submission response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching writing test submission:", error);
    throw error;
  }
}

export async function updateWritingEvaluation(
  testId: string,
  userId: string,
  partId: string,
  evaluation: any
) {
  try {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/submitAnswers/submitWritingAnswers/${testId}/${userId}`,
      {
        partId,
        evaluation,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating writing evaluation:", error);
    throw error;
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

// Listening Submit Answers

export async function postSubmitListeningTest(formData: any) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/submitAnswers/submitListeningAnswers`,
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

export async function getSubmitListeningTest(testId: any, userId: any) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/submitAnswers/submitListeningAnswers/${testId}/${userId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}
