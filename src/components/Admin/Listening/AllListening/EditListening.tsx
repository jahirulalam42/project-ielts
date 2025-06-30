import React from "react";

const EditListening = ({
  editedTest,
  setEditedTest,
  setShowEditModal,
  saveChanges,
}: any) => {
  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-5xl max-h-[90vh] overflow-y-auto">
        <h3 className="font-bold text-xl mb-6">Edit Listening Test</h3>

        {/* Test Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Test Title</span>
            </label>
            <input
              type="text"
              value={editedTest.title}
              onChange={(e) =>
                setEditedTest({ ...editedTest, title: e.target.value })
              }
              className="input input-bordered"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Type</span>
            </label>
            <select
              value={editedTest.type}
              onChange={(e) =>
                setEditedTest({ ...editedTest, type: e.target.value })
              }
              className="select select-bordered"
            >
              <option value="general">General</option>
              <option value="academic">Academic</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Duration (minutes)</span>
            </label>
            <input
              type="number"
              value={editedTest.duration}
              onChange={(e) =>
                setEditedTest({
                  ...editedTest,
                  duration: parseInt(e.target.value),
                })
              }
              className="input input-bordered"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Audio URL</span>
            </label>
            <input
              type="text"
              value={editedTest.audioUrl}
              onChange={(e) =>
                setEditedTest({ ...editedTest, audioUrl: e.target.value })
              }
              className="input input-bordered"
            />
          </div>
        </div>

        {/* Parts Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold">Parts</h4>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => {
                setEditedTest({
                  ...editedTest,
                  parts: [
                    ...editedTest.parts,
                    {
                      title: `Part ${editedTest.parts.length + 1}`,
                      questions: [],
                    },
                  ],
                });
              }}
            >
              Add Part
            </button>
          </div>

          {editedTest.parts.map((part: any, partIndex: number) => (
            <div
              key={partIndex}
              className="collapse collapse-arrow bg-base-200 mb-4"
            >
              <input type="checkbox" defaultChecked={partIndex === 0} />
              <div className="collapse-title text-xl font-medium">
                <input
                  type="text"
                  value={part.title}
                  onChange={(e) => {
                    const newParts = [...editedTest.parts];
                    newParts[partIndex].title = e.target.value;
                    setEditedTest({ ...editedTest, parts: newParts });
                  }}
                  className="input input-sm w-full max-w-xs bg-transparent border-none"
                />
              </div>
              <div className="collapse-content">
                {/* Question Groups */}
                <div className="ml-4">
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="font-medium">Question Groups</h5>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-xs btn-primary"
                        onClick={() => {
                          const newParts = [...editedTest.parts];
                          newParts[partIndex].questions.push({
                            fill_in_the_blanks_with_subtitle: [],
                          });
                          setEditedTest({ ...editedTest, parts: newParts });
                        }}
                      >
                        Add Fill Blanks
                      </button>
                      <button
                        className="btn btn-xs btn-secondary"
                        onClick={() => {
                          const newParts = [...editedTest.parts];
                          newParts[partIndex].questions.push({ mcq: [] });
                          setEditedTest({ ...editedTest, parts: newParts });
                        }}
                      >
                        Add MCQ
                      </button>
                      <button
                        className="btn btn-xs btn-accent"
                        onClick={() => {
                          const newParts = [...editedTest.parts];
                          newParts[partIndex].questions.push({ map: [] });
                          setEditedTest({ ...editedTest, parts: newParts });
                        }}
                      >
                        Add Map
                      </button>
                    </div>
                  </div>

                  {part.questions.map(
                    (questionGroup: any, groupIndex: number) => {
                      const questionType = Object.keys(questionGroup)[0];
                      const questions = questionGroup[questionType];

                      return (
                        <div
                          key={groupIndex}
                          className="mb-6 p-4 bg-base-100 rounded-lg"
                        >
                          <div className="flex justify-between items-center mb-3">
                            <span className="badge badge-info capitalize">
                              {questionType.replace(/_/g, " ")}
                            </span>
                            <button
                              className="btn btn-xs btn-error"
                              onClick={() => {
                                const newParts = [...editedTest.parts];
                                newParts[partIndex].questions.splice(
                                  groupIndex,
                                  1
                                );
                                setEditedTest({
                                  ...editedTest,
                                  parts: newParts,
                                });
                              }}
                            >
                              Remove
                            </button>
                          </div>

                          {/* Fill in the blanks editor */}
                          {questionType ===
                            "fill_in_the_blanks_with_subtitle" && (
                            <div className="space-y-4">
                              {questions.map((item: any, itemIndex: number) => (
                                <div
                                  key={itemIndex}
                                  className="border rounded-lg p-4"
                                >
                                  {/* Only show title field for the first section */}
                                  {itemIndex === 0 && (
                                    <div className="form-control mb-3">
                                      <label className="label">
                                        <span className="label-text">Title</span>
                                      </label>
                                      <input
                                        type="text"
                                        value={item.title || ""}
                                        onChange={(e) => {
                                          const newParts = [...editedTest.parts];
                                          newParts[partIndex].questions[
                                            groupIndex
                                          ][questionType][itemIndex].title =
                                            e.target.value;
                                          setEditedTest({
                                            ...editedTest,
                                            parts: newParts,
                                          });
                                        }}
                                        className="input input-bordered input-sm"
                                      />
                                    </div>
                                  )}

                                  <div className="form-control mb-3">
                                    <label className="label">
                                      <span className="label-text">
                                        Subtitle
                                      </span>
                                    </label>
                                    <input
                                      type="text"
                                      value={item.subtitle}
                                      onChange={(e) => {
                                        const newParts = [...editedTest.parts];
                                        newParts[partIndex].questions[
                                          groupIndex
                                        ][questionType][itemIndex].subtitle =
                                          e.target.value;
                                        setEditedTest({
                                          ...editedTest,
                                          parts: newParts,
                                        });
                                      }}
                                      className="input input-bordered input-sm"
                                    />
                                  </div>

                                  <div className="form-control mb-3">
                                    <label className="label">
                                      <span className="label-text">
                                        Extra Content (one per line)
                                      </span>
                                    </label>
                                    <textarea
                                      value={item.extra.join("\n")}
                                      onChange={(e) => {
                                        const newParts = [...editedTest.parts];
                                        newParts[partIndex].questions[
                                          groupIndex
                                        ][questionType][itemIndex].extra =
                                          e.target.value.split("\n");
                                        setEditedTest({
                                          ...editedTest,
                                          parts: newParts,
                                        });
                                      }}
                                      className="textarea textarea-bordered h-32"
                                    />
                                  </div>

                                  <div className="mt-4">
                                    <h6 className="font-medium mb-2">
                                      Questions
                                    </h6>
                                    {item.questions?.map(
                                      (q: any, qIndex: number) => (
                                        <div
                                          key={qIndex}
                                          className="flex items-center gap-3 mb-2"
                                        >
                                          <span className="font-medium">
                                            Q{q.question_number}:
                                          </span>
                                          <input
                                            type="text"
                                            placeholder="Answer"
                                            value={q.answer}
                                            onChange={(e) => {
                                              const newParts = [
                                                ...editedTest.parts,
                                              ];
                                              newParts[partIndex].questions[
                                                groupIndex
                                              ][questionType][
                                                itemIndex
                                              ].questions[qIndex].answer =
                                                e.target.value;
                                              setEditedTest({
                                                ...editedTest,
                                                parts: newParts,
                                              });
                                            }}
                                            className="input input-bordered input-sm"
                                          />
                                          <button
                                            className="btn btn-xs btn-error"
                                            onClick={() => {
                                              const newParts = [
                                                ...editedTest.parts,
                                              ];
                                              newParts[partIndex].questions[
                                                groupIndex
                                              ][questionType][
                                                itemIndex
                                              ].questions.splice(qIndex, 1);
                                              setEditedTest({
                                                ...editedTest,
                                                parts: newParts,
                                              });
                                            }}
                                          >
                                            Remove
                                          </button>
                                        </div>
                                      )
                                    )}

                                    <button
                                      className="btn btn-xs btn-primary mt-2"
                                      onClick={() => {
                                        const newParts = [...editedTest.parts];
                                        const newQuestion = {
                                          question_number:
                                            item.questions.length + 1,
                                          answer: "",
                                          input_type: "text",
                                        };
                                        newParts[partIndex].questions[
                                          groupIndex
                                        ][questionType][
                                          itemIndex
                                        ].questions.push(newQuestion);
                                        setEditedTest({
                                          ...editedTest,
                                          parts: newParts,
                                        });
                                      }}
                                    >
                                      Add Question
                                    </button>
                                  </div>
                                </div>
                              ))}

                              <button
                                className="btn btn-xs btn-primary mt-2"
                                onClick={() => {
                                  const newParts = [...editedTest.parts];
                                  newParts[partIndex].questions[groupIndex][
                                    questionType
                                  ].push({
                                    title: "",
                                    subtitle: "",
                                    extra: [],
                                    questions: [],
                                  });
                                  setEditedTest({
                                    ...editedTest,
                                    parts: newParts,
                                  });
                                }}
                              >
                                Add New Blank Section
                              </button>
                            </div>
                          )}

                          {/* MCQ Editor */}
                          {questionType === "mcq" && (
                            <div className="space-y-4">
                              {questions.map((mcq: any, mcqIndex: number) => (
                                <div
                                  key={mcqIndex}
                                  className="border rounded-lg p-4"
                                >
                                  <div className="form-control mb-3">
                                    <label className="label">
                                      <span className="label-text">
                                        Question Number
                                      </span>
                                    </label>
                                    <input
                                      type="number"
                                      value={mcq.question_number}
                                      onChange={(e) => {
                                        const newParts = [...editedTest.parts];
                                        newParts[partIndex].questions[
                                          groupIndex
                                        ][questionType][
                                          mcqIndex
                                        ].question_number = parseInt(
                                          e.target.value
                                        );
                                        setEditedTest({
                                          ...editedTest,
                                          parts: newParts,
                                        });
                                      }}
                                      className="input input-bordered input-sm"
                                    />
                                  </div>

                                  <div className="form-control mb-3">
                                    <label className="label">
                                      <span className="label-text">
                                        Question Text
                                      </span>
                                    </label>
                                    <input
                                      type="text"
                                      value={mcq.question}
                                      onChange={(e) => {
                                        const newParts = [...editedTest.parts];
                                        newParts[partIndex].questions[
                                          groupIndex
                                        ][questionType][mcqIndex].question =
                                          e.target.value;
                                        setEditedTest({
                                          ...editedTest,
                                          parts: newParts,
                                        });
                                      }}
                                      className="input input-bordered"
                                    />
                                  </div>

                                  <div className="form-control mb-3">
                                    <label className="label">
                                      <span className="label-text">
                                        Correct Answer
                                      </span>
                                    </label>
                                    <select
                                      value={mcq.answer}
                                      onChange={(e) => {
                                        const newParts = [...editedTest.parts];
                                        newParts[partIndex].questions[
                                          groupIndex
                                        ][questionType][mcqIndex].answer =
                                          e.target.value;
                                        setEditedTest({
                                          ...editedTest,
                                          parts: newParts,
                                        });
                                      }}
                                      className="select select-bordered"
                                    >
                                      {mcq.options.map((opt: any) => (
                                        <option
                                          key={opt.label}
                                          value={opt.value}
                                        >
                                          {opt.label}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  <div className="mt-4">
                                    <h6 className="font-medium mb-2">
                                      Options
                                    </h6>
                                    {mcq.options.map(
                                      (option: any, optIndex: number) => (
                                        <div
                                          key={optIndex}
                                          className="flex items-center gap-3 mb-2"
                                        >
                                          <input
                                            type="text"
                                            placeholder="Label"
                                            value={option.label}
                                            onChange={(e) => {
                                              const newParts = [
                                                ...editedTest.parts,
                                              ];
                                              newParts[partIndex].questions[
                                                groupIndex
                                              ][questionType][mcqIndex].options[
                                                optIndex
                                              ].label = e.target.value;
                                              setEditedTest({
                                                ...editedTest,
                                                parts: newParts,
                                              });
                                            }}
                                            className="input input-bordered input-sm w-16"
                                          />
                                          <input
                                            type="text"
                                            placeholder="Value"
                                            value={option.value}
                                            onChange={(e) => {
                                              const newParts = [
                                                ...editedTest.parts,
                                              ];
                                              newParts[partIndex].questions[
                                                groupIndex
                                              ][questionType][mcqIndex].options[
                                                optIndex
                                              ].value = e.target.value;
                                              setEditedTest({
                                                ...editedTest,
                                                parts: newParts,
                                              });
                                            }}
                                            className="input input-bordered input-sm"
                                          />
                                          <button
                                            className="btn btn-xs btn-error"
                                            onClick={() => {
                                              const newParts = [
                                                ...editedTest.parts,
                                              ];
                                              newParts[partIndex].questions[
                                                groupIndex
                                              ][questionType][
                                                mcqIndex
                                              ].options.splice(optIndex, 1);
                                              setEditedTest({
                                                ...editedTest,
                                                parts: newParts,
                                              });
                                            }}
                                          >
                                            Remove
                                          </button>
                                        </div>
                                      )
                                    )}

                                    <button
                                      className="btn btn-xs btn-primary mt-2"
                                      onClick={() => {
                                        const newParts = [...editedTest.parts];
                                        newParts[partIndex].questions[
                                          groupIndex
                                        ][questionType][mcqIndex].options.push({
                                          label: "New",
                                          value: "new",
                                        });
                                        setEditedTest({
                                          ...editedTest,
                                          parts: newParts,
                                        });
                                      }}
                                    >
                                      Add Option
                                    </button>
                                  </div>
                                </div>
                              ))}

                              <button
                                className="btn btn-xs btn-primary mt-2"
                                onClick={() => {
                                  const newParts = [...editedTest.parts];
                                  newParts[partIndex].questions[groupIndex][
                                    questionType
                                  ].push({
                                    question_number: questions.length + 1,
                                    question: "",
                                    answer: "A",
                                    options: [
                                      { label: "A", value: "a" },
                                      { label: "B", value: "b" },
                                    ],
                                    input_type: "radio",
                                    min_selection: 1,
                                    max_selection: 1,
                                  });
                                  setEditedTest({
                                    ...editedTest,
                                    parts: newParts,
                                  });
                                }}
                              >
                                Add New MCQ
                              </button>
                            </div>
                          )}

                          {/* Map Editor */}
                          {questionType === "map" && (
                            <div className="space-y-4">
                              {questions.map((map: any, mapIndex: number) => (
                                <div
                                  key={mapIndex}
                                  className="border rounded-lg p-4"
                                >
                                  <div className="form-control mb-3">
                                    <label className="label">
                                      <span className="label-text">Title</span>
                                    </label>
                                    <input
                                      type="text"
                                      value={map.title}
                                      onChange={(e) => {
                                        const newParts = [...editedTest.parts];
                                        newParts[partIndex].questions[
                                          groupIndex
                                        ][questionType][mapIndex].title =
                                          e.target.value;
                                        setEditedTest({
                                          ...editedTest,
                                          parts: newParts,
                                        });
                                      }}
                                      className="input input-bordered"
                                    />
                                  </div>

                                  <div className="form-control mb-3">
                                    <label className="label">
                                      <span className="label-text">
                                        Image URL
                                      </span>
                                    </label>
                                    <input
                                      type="text"
                                      value={map.image}
                                      onChange={(e) => {
                                        const newParts = [...editedTest.parts];
                                        newParts[partIndex].questions[
                                          groupIndex
                                        ][questionType][mapIndex].image =
                                          e.target.value;
                                        setEditedTest({
                                          ...editedTest,
                                          parts: newParts,
                                        });
                                      }}
                                      className="input input-bordered"
                                    />
                                  </div>

                                  <div className="form-control mb-3">
                                    <label className="label">
                                      <span className="label-text">
                                        Labels (comma separated)
                                      </span>
                                    </label>
                                    <input
                                      type="text"
                                      value={map.labels.join(", ")}
                                      onChange={(e) => {
                                        const newParts = [...editedTest.parts];
                                        newParts[partIndex].questions[
                                          groupIndex
                                        ][questionType][mapIndex].labels =
                                          e.target.value
                                            .split(",")
                                            .map((l: string) => l.trim());
                                        setEditedTest({
                                          ...editedTest,
                                          parts: newParts,
                                        });
                                      }}
                                      className="input input-bordered"
                                    />
                                  </div>

                                  <div className="mt-4">
                                    <h6 className="font-medium mb-2">
                                      Questions
                                    </h6>
                                    {map.questions.map(
                                      (q: any, qIndex: number) => (
                                        <div
                                          key={qIndex}
                                          className="border rounded p-3 mb-3"
                                        >
                                          <div className="form-control mb-2">
                                            <label className="label">
                                              <span className="label-text">
                                                Question Number
                                              </span>
                                            </label>
                                            <input
                                              type="number"
                                              value={q.question_number}
                                              onChange={(e) => {
                                                const newParts = [
                                                  ...editedTest.parts,
                                                ];
                                                newParts[partIndex].questions[
                                                  groupIndex
                                                ][questionType][
                                                  mapIndex
                                                ].questions[
                                                  qIndex
                                                ].question_number = parseInt(
                                                  e.target.value
                                                );
                                                setEditedTest({
                                                  ...editedTest,
                                                  parts: newParts,
                                                });
                                              }}
                                              className="input input-bordered input-sm"
                                            />
                                          </div>

                                          <div className="form-control mb-2">
                                            <label className="label">
                                              <span className="label-text">
                                                Question Text
                                              </span>
                                            </label>
                                            <input
                                              type="text"
                                              value={q.question}
                                              onChange={(e) => {
                                                const newParts = [
                                                  ...editedTest.parts,
                                                ];
                                                newParts[partIndex].questions[
                                                  groupIndex
                                                ][questionType][
                                                  mapIndex
                                                ].questions[qIndex].question =
                                                  e.target.value;
                                                setEditedTest({
                                                  ...editedTest,
                                                  parts: newParts,
                                                });
                                              }}
                                              className="input input-bordered input-sm"
                                            />
                                          </div>

                                          <div className="form-control mb-2">
                                            <label className="label">
                                              <span className="label-text">
                                                Correct Answer
                                              </span>
                                            </label>
                                            <select
                                              value={q.answer}
                                              onChange={(e) => {
                                                const newParts = [
                                                  ...editedTest.parts,
                                                ];
                                                newParts[partIndex].questions[
                                                  groupIndex
                                                ][questionType][
                                                  mapIndex
                                                ].questions[qIndex].answer =
                                                  e.target.value;
                                                setEditedTest({
                                                  ...editedTest,
                                                  parts: newParts,
                                                });
                                              }}
                                              className="select select-bordered select-sm"
                                            >
                                              {map.labels.map(
                                                (label: string) => (
                                                  <option
                                                    key={label}
                                                    value={label}
                                                  >
                                                    {label}
                                                  </option>
                                                )
                                              )}
                                            </select>
                                          </div>
                                        </div>
                                      )
                                    )}

                                    <button
                                      className="btn btn-xs btn-primary mt-2"
                                      onClick={() => {
                                        const newParts = [...editedTest.parts];
                                        newParts[partIndex].questions[
                                          groupIndex
                                        ][questionType][
                                          mapIndex
                                        ].questions.push({
                                          question_number:
                                            map.questions.length + 1,
                                          question: "",
                                          answer: map.labels[0] || "",
                                          input_type: "radio",
                                          min_selection: 1,
                                          max_selection: 1,
                                        });
                                        setEditedTest({
                                          ...editedTest,
                                          parts: newParts,
                                        });
                                      }}
                                    >
                                      Add Map Question
                                    </button>
                                  </div>
                                </div>
                              ))}

                              <button
                                className="btn btn-xs btn-primary mt-2"
                                onClick={() => {
                                  const newParts = [...editedTest.parts];
                                  newParts[partIndex].questions[groupIndex][
                                    questionType
                                  ].push({
                                    title: "",
                                    image: "",
                                    labels: ["A", "B", "C"],
                                    questions: [],
                                  });
                                  setEditedTest({
                                    ...editedTest,
                                    parts: newParts,
                                  });
                                }}
                              >
                                Add New Map
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="modal-action">
          <button
            className="btn btn-ghost"
            onClick={() => setShowEditModal(false)}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              saveChanges();
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditListening;
