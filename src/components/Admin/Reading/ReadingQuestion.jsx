"use client"; // Ensure this is at the top of the file

import React, { useState } from "react";

const ReadingQuestion = () => {
  // States to track form selections
  const [questionType, setQuestionType] = useState("mcq");
  const [inputType, setInputType] = useState("text");
  const [numQuestions, setNumQuestions] = useState(1);
  const [questions, setQuestions] = useState([]); // Store the added questions

  // Handle the question type change
  const handleQuestionTypeChange = (e) => {
    setQuestionType(e.target.value);
  };

  // Handle the input type change
  const handleInputTypeChange = (e) => {
    setInputType(e.target.value);
  };

  // Handle the number of questions change
  const handleNumQuestionsChange = (e) => {
    setNumQuestions(parseInt(e.target.value, 10));
  };

  // Handle form submission (adding questions)
  const handleSubmit = () => {
    // Create JSON structure for the selected question type
    const questionData = generateQuestionData();
    // Output the formatted JSON to console
    console.log(JSON.stringify(questionData, null, 2));
  };

  // Function to handle question input changes
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
  };

  // Generate question data in the specified format
  const generateQuestionData = () => {
    switch (questionType) {
      case "mcq":
        return {
          mcq: questions.map((question, idx) => ({
            question_number: idx + 1,
            question: question.question,
            answer: [question.correctAnswer],
            options: [
              { label: "A", value: question.option1 },
              { label: "B", value: question.option2 },
              { label: "C", value: question.option3 },
              { label: "D", value: question.option4 },
            ],
            input_type: "radio",
            min_selection: 1,
            max_selection: 1,
          })),
        };

      case "true_false_not_given":
        return {
          true_false_not_given: questions.map((question, idx) => ({
            question_number: idx + 1,
            question: question.question,
            answer: question.answer,
            input_type: "dropdown",
          })),
        };

      case "fill_in_the_blanks":
        return {
          fill_in_the_blanks: questions.map((question, idx) => ({
            question_number: idx + 1,
            question: question.question,
            answer: question.answer,
            input_type: "text",
          })),
        };

      case "fill_in_the_blanks_with_subtitle":
        return {
          fill_in_the_blanks_with_subtitle: questions.map((question, idx) => ({
            title: "",
            subtitle: question.subtitle,
            extra: [
              question.extraSentence,
              question.extraSentence2,
              question.extraSentence3,
            ],
            questions: [
              {
                question_number: idx + 1,
                answer: question.answer,
                input_type: "text",
              },
            ],
          })),
        };

      case "paragraph_matching":
        return {
          paragraph_matching: questions.map((question, idx) => ({
            question_number: idx + 1,
            question: question.question,
            answer: question.answer,
            options: [
              { label: "A", value: "A" },
              { label: "B", value: "B" },
              { label: "C", value: "C" },
              { label: "D", value: "D" },
              { label: "E", value: "E" },
              { label: "F", value: "F" },
            ],
            input_type: "dropdown",
          })),
        };

      case "summary_fill_in_the_blanks":
        return {
          summary_fill_in_the_blanks: {
            question_numbers: [31, 32, 33, 34, 35, 36],
            passage:
              "Maryam Mirzakhani is regarded as [31] in the field of mathematics because she was the only female holder of the prestigious Fields Medal — a record that she retained at the time of her death. However, maths held little [32] for her as a child and in fact her performance was below average until she was [33] by a difficult puzzle that one of her siblings showed her. Later, as a professional mathematician, she had an inquiring mind and proved herself to be [34] when things did not go smoothly. She said she got the greatest [35] from making ground-breaking discoveries and in fact she was responsible for some extremely [36] mathematical studies.",
            answers: {
              31: "G",
              32: "J",
              33: "H",
              34: "B",
              35: "E",
              36: "C",
            },
            options: [
              { label: "A", value: "appeal" },
              { label: "B", value: "determined" },
              { label: "C", value: "intrigued" },
              { label: "D", value: "single" },
              { label: "E", value: "achievement" },
              { label: "F", value: "devoted" },
              { label: "G", value: "involved" },
              { label: "H", value: "unique" },
              { label: "I", value: "innovative" },
              { label: "J", value: "satisfaction" },
              { label: "K", value: "intent" },
            ],
            input_type: "drag_and_drop",
          },
        };

      case "matching_headings":
        return {
          matching_headings: questions.map((question, idx) => ({
            question_number: idx + 1,
            question: question.question,
            answer: question.answer,
            options: [
              { label: "A", value: "A" },
              { label: "B", value: "B" },
              { label: "C", value: "C" },
              { label: "D", value: "D" },
              { label: "E", value: "E" },
              { label: "F", value: "F" },
            ],
            input_type: "dropdown",
          })),
        };

      case "multiple_mcq":
        return {
          multiple_mcq: questions.map((question, idx) => ({
            question_numbers: [20, 21],
            question: question.question,
            options: [
              { label: "A", value: question.optionA },
              { label: "B", value: question.optionB },
              { label: "C", value: question.optionC },
              { label: "D", value: question.optionD },
            ],
            input_type: "checkbox",
            min_selection: 2,
            max_selection: 2,
            correct_mapping: {
              20: "B",
              21: "C",
            },
          })),
        };

      case "passage_fill_in_the_blanks":
        return {
          passage_fill_in_the_blanks: questions.map((question, idx) => ({
            question_number: idx + 1,
            instruction:
              "Complete the summary below. Choose ONE WORD ONLY from the passage for each answer.",
            text: question.text,
            blanks: question.blanks.map((blank, index) => ({
              blank_number: blank.blank_number,
              input_type: "text",
              answer: blank.answer,
            })),
          })),
        };

      default:
        return {};
    }
  };

  // Dynamically render the form based on the selected question type
  const renderQuestionFields = () => {
    switch (questionType) {
      case "mcq":
        return (
          <div>
            {[...Array(numQuestions)].map((_, idx) => (
              <div key={idx}>
                <input
                  type="text"
                  placeholder={`Question ${idx + 1}`}
                  onChange={(e) =>
                    handleQuestionChange(idx, "question", e.target.value)
                  }
                />
                <div>
                  {[...Array(4)].map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      placeholder={`Option ${i + 1}`}
                      onChange={(e) =>
                        handleQuestionChange(
                          idx,
                          `option${i + 1}`,
                          e.target.value
                        )
                      }
                    />
                  ))}
                </div>
                <select
                  onChange={(e) =>
                    handleQuestionChange(idx, "correctAnswer", e.target.value)
                  }
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
            ))}
          </div>
        );

      case "true_false_not_given":
        return (
          <div>
            {[...Array(numQuestions)].map((_, idx) => (
              <div key={idx}>
                <input
                  type="text"
                  placeholder={`Question ${idx + 1}`}
                  onChange={(e) =>
                    handleQuestionChange(idx, "question", e.target.value)
                  }
                />
                <select
                  onChange={(e) =>
                    handleQuestionChange(idx, "answer", e.target.value)
                  }
                >
                  <option value="true">True</option>
                  <option value="false">False</option>
                  <option value="not_given">Not Given</option>
                </select>
              </div>
            ))}
          </div>
        );

      case "fill_in_the_blanks":
        return (
          <div>
            {[...Array(numQuestions)].map((_, idx) => (
              <div key={idx}>
                <input
                  type="text"
                  placeholder={`Question ${idx + 1}`}
                  onChange={(e) =>
                    handleQuestionChange(idx, "question", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Answer"
                  onChange={(e) =>
                    handleQuestionChange(idx, "answer", e.target.value)
                  }
                />
              </div>
            ))}
          </div>
        );

      // Add similar renderings for other question types

      default:
        return null;
    }
  };

  return (
    <div>
      <h2>This page is for Adding Questions</h2>
      <div>
        <label>Question Type:</label>
        <select value={questionType} onChange={handleQuestionTypeChange}>
          <option value="mcq">Multiple Choice</option>
          <option value="true_false_not_given">True/False/Not Given</option>
          <option value="fill_in_the_blanks">Fill in the Blanks</option>
          <option value="fill_in_the_blanks_with_subtitle">
            Fill in the Blanks with Subtitle
          </option>
          <option value="paragraph_matching">Paragraph Matching</option>
          <option value="summary_fill_in_the_blanks">
            Summary Fill in the Blanks
          </option>
          <option value="matching_headings">Matching Headings</option>
          <option value="multiple_mcq">Multiple MCQs</option>
          <option value="passage_fill_in_the_blanks">
            Passage Fill in the Blanks
          </option>
        </select>
      </div>

      {/* <div>
        <label>Input Type:</label>
        <select value={inputType} onChange={handleInputTypeChange}>
          <option value="text">Text</option>
          <option value="radio">Radio Buttons</option>
          <option value="dropdown">Dropdown</option>
          <option value="checkbox">Checkbox</option>
        </select>
      </div> */}

      <div>
        <label>Number of Questions:</label>
        <input
          type="number"
          value={numQuestions}
          onChange={handleNumQuestionsChange}
          min="1"
        />
      </div>

      <div>{renderQuestionFields()}</div>

      <button onClick={handleSubmit}>Add Questions</button>
    </div>
  );
};

export default ReadingQuestion;
