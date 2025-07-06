import axios from "axios";

// Users

export async function getAllUsers() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/users`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function postUser(formData: any) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/users`,
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

export const updateUser = async (id: string, updates: any) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update user");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in User:", error);
    throw error;
  }
};

export async function deleteUser(paramsId: any) {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${paramsId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

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

// services/data.ts
export const editReadingTest = async (id: string, updates: any) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/readingQuestions/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update reading test");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in editReadingTest:", error);
    throw error;
  }
};

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
    console.log("Sending data to API:", formData);
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/readingQuestions`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("API Response:", response.data);
    // return response.data;
    return {
      success: true,
    };
  } catch (error: any) {
    console.error("Full error object:", error);
    console.error("Error response data:", error.response?.data);
    console.error("Error status:", error.response?.status);
    console.error("Error message:", error.message);
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

export const updateWritingTest = async (id: string, updates: any) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/writingQuestions/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update writing test");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in Update Writing Test:", error);
    throw error;
  }
};

export async function deleteWritingTest(paramsId: any) {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/writingQuestions/${paramsId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
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

export const editListeningTest = async (id: string, updates: any) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/listeningQuestions/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update listening test");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in editListeningTest:", error);
    throw error;
  }
};

export async function deleteListeningTest(paramsId: any) {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/listeningQuestions/${paramsId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
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

// Speaking Questions
export async function getSpeakingTests() {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/speakingQuestions`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getSpeakingTestById(id: string) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/speakingQuestions/${id}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function submitSpeakingQuestions(formData: any) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/speakingQuestions`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const editSpeakingTest = async (id: string, updates: any) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/speakingQuestions/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update speaking test");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in editSpeakingTest:", error);
    throw error;
  }
};

export async function deleteSpeakingTest(paramsId: any) {
  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/speakingQuestions/${paramsId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

// Speaking Submit Answers
export async function postSubmitSpeakingTest(formData: any) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/submitAnswers/submitSpeakingAnswers`,
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
    throw error;
  }
}

export async function getSubmitSpeakingTest(testId: any, userId: any) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/submitAnswers/submitSpeakingAnswers?testId=${testId}&userId=${userId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

// Speaking Audio Analysis
export async function analyzeSpeakingAudio(audioData: any) {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/speaking/analyze`,
      audioData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
