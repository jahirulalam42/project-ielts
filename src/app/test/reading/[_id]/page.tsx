// app/readingQuestions/[_id]/page.tsx

import Image from "next/image";

export async function generateMetadata({
    params,
}: {
    params: { _id: string };
}) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/readingQuestions/${params._id}`
    );
    const response = await res.json();
    const pageTitle = response?.data?.title || "IELTS Reading Test";
    return { title: pageTitle };
}

export default async function ReadingQuestionPage({
    params,
}: {
    params: { _id: string };
}) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/readingQuestions/${params._id}`,
        { cache: "no-store" }
    );
    const response = await res.json();

    if (!response.success || !response.data) {
        return <div className="text-center p-4">No reading test found.</div>;
    }

    const test = response.data;

    return (
        <div className="max-w-3xl mx-auto p-6">
            {/* Exam Header */}
            <div className="card bg-base-100 shadow-xl mb-6">
                <div className="card-body">
                    <h1 className="card-title text-3xl">{test.title}</h1>
                    <p className="text-lg">Type: {test.type}</p>
                    <p className="text-lg">Duration: {test.duration} minutes</p>
                </div>
            </div>

            {/* Each Reading Part */}
            {test.parts &&
                test.parts.map((part: any, index: number) => (
                    <div key={index} className="card bg-base-100 shadow-xl mb-6">
                        <div className="card-body">
                            <h2 className="card-title text-2xl">{part.title}</h2>
                            {part.instructions && (
                                <p className="italic text-gray-600 mb-4">{part.instructions}</p>
                            )}

                            {/* Passage Section */}
                            {part.passage && (
                                <div className="mb-4">
                                    {part.passage_title && (
                                        <h3 className="text-xl font-medium mb-2">
                                            {part.passage_title}
                                        </h3>
                                    )}
                                    <div className="prose max-w-none">
                                        {Array.isArray(part.passage)
                                            ? part.passage.map((p: any, i: number) => {
                                                if (typeof p === "object" && p !== null) {
                                                    return Object.entries(p).map(([key, value]) => (
                                                        <p key={`${i}-${key}`}>{value as React.ReactNode}</p>
                                                    ));
                                                }
                                                return <p key={i}>{p}</p>;
                                            })
                                            : <p>{part.passage}</p>}
                                    </div>
                                </div>
                            )}

                            {/* Image */}
                            {part.image && (
                                <div className="mb-4">
                                    <Image
                                        src={part.image}
                                        alt={part.title || "Passage Image"}
                                        width={600}
                                        height={400}
                                        className="rounded-lg"
                                    />
                                </div>
                            )}

                            {/* Questions Section */}
                            {part.questions && (
                                <div className="mt-4">
                                    <h4 className="text-xl font-semibold mb-3">Questions</h4>
                                    <div className="space-y-6">
                                        {/* True/False/Not Given */}
                                        {part.questions.true_false_not_given && (
                                            <div>
                                                <h5 className="font-medium mb-2">
                                                    True/False/Not Given
                                                </h5>
                                                {part.questions.true_false_not_given.map((q: any) => (
                                                    <div
                                                        key={q.question_number}
                                                        className="p-4 border rounded-lg mb-2"
                                                    >
                                                        <p>
                                                            <strong>{q.question_number}. </strong>
                                                            {q.question}
                                                        </p>
                                                        <select className="select select-bordered mt-2 w-full">
                                                            <option disabled selected>
                                                                Select answer
                                                            </option>
                                                            <option value="True">True</option>
                                                            <option value="False">False</option>
                                                            <option value="Not Given">Not Given</option>
                                                        </select>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Fill in the Blanks (Individual Questions) */}
                                        {part.questions.fill_in_the_blanks &&
                                            Array.isArray(part.questions.fill_in_the_blanks) && (
                                                <div>
                                                    <h5 className="font-medium mb-2">Fill in the Blanks</h5>
                                                    {part.questions.fill_in_the_blanks.map((q: any) => (
                                                        <div
                                                            key={q.question_number}
                                                            className="p-4 border rounded-lg mb-2"
                                                        >
                                                            <p>
                                                                <strong>{q.question_number}. </strong>
                                                                {q.question}
                                                            </p>
                                                            <input
                                                                type="text"
                                                                placeholder={"Write the answer here"}
                                                                className="input input-bordered mt-2 w-full"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                        {/* Fill in the Blanks (Passage) */}
                                        {part.questions.fill_in_the_blanks &&
                                            !Array.isArray(part.questions.fill_in_the_blanks) && (
                                                <div>
                                                    <h5 className="font-medium mb-2">
                                                        Fill in the Blanks (Passage)
                                                    </h5>
                                                    <div className="p-4 border rounded-lg mb-2">
                                                        <p>{part.questions.fill_in_the_blanks.passage}</p>
                                                        <div className="mt-4 space-y-3">
                                                            {part.questions.fill_in_the_blanks.question_numbers.map(
                                                                (num: number) => (
                                                                    <div
                                                                        key={num}
                                                                        className="flex items-center space-x-3"
                                                                    >
                                                                        <span className="font-bold">
                                                                            Blank {num}:
                                                                        </span>
                                                                        <input
                                                                            type="text"
                                                                            placeholder={
                                                                                "Write the answer here"
                                                                            }
                                                                            className="input input-bordered w-full"
                                                                        />
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                        {/* Matching Headings */}
                                        {part.questions.matching_headings && (
                                            <div>
                                                <h5 className="font-medium mb-2">Matching Headings</h5>
                                                <p className="italic mb-2 text-gray-600">
                                                    Match each paragraph with the correct heading.
                                                </p>
                                                {part.questions.matching_headings.paragraphs.map(
                                                    (p: any, i: number) => (
                                                        <div
                                                            key={i}
                                                            className="p-4 border rounded-lg mb-2"
                                                        >
                                                            <p>{p.text}</p>
                                                            <select className="select select-bordered mt-2 w-full">
                                                                <option disabled selected>
                                                                    Select heading
                                                                </option>
                                                                {part.questions.matching_headings.headings.map(
                                                                    (heading: string, idx: number) => (
                                                                        <option key={idx} value={heading}>
                                                                            {heading}
                                                                        </option>
                                                                    )
                                                                )}
                                                            </select>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}

                                        {/* Paragraph Matching */}
                                        {part.questions.paragraph_matching && (
                                            <div>
                                                <h5 className="font-medium mb-2">Paragraph Matching</h5>
                                                {part.questions.paragraph_matching.map((q: any) => (
                                                    <div
                                                        key={q.question_number}
                                                        className="p-4 border rounded-lg mb-2"
                                                    >
                                                        <p>
                                                            <strong>{q.question_number}. </strong>
                                                            {q.question}
                                                        </p>
                                                        <select className="select select-bordered mt-2 w-full">
                                                            <option disabled selected>
                                                                Select answer
                                                            </option>
                                                            {q.options.map((option: any) => (
                                                                <option
                                                                    key={option.value}
                                                                    value={option.value}
                                                                >
                                                                    {option.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Multiple Choice Questions (MCQ) */}
                                        {part.questions.mcq && (
                                            <div>
                                                <h5 className="font-medium mb-2">
                                                    Multiple Choice Questions
                                                </h5>
                                                {part.questions.mcq.map((q: any, idx: number) => (
                                                    <div
                                                        key={idx}
                                                        className="p-4 border rounded-lg mb-2"
                                                    >
                                                        <p>
                                                            <strong>
                                                                {Array.isArray(q.question_number)
                                                                    ? q.question_number.join(", ")
                                                                    : q.question_number}
                                                                .{" "}
                                                            </strong>
                                                            {q.question}
                                                        </p>
                                                        <div className="mt-2 space-y-2">
                                                            {q.options.map((option: any) => (
                                                                <label
                                                                    key={option.label}
                                                                    className="flex items-center space-x-2"
                                                                >
                                                                    <input
                                                                        type={
                                                                            q.input_type === "checkbox"
                                                                                ? "checkbox"
                                                                                : "radio"
                                                                        }
                                                                        name={`mcq-${idx}`}
                                                                        value={option.label}
                                                                        className="checkbox checkbox-primary"
                                                                    />
                                                                    <span>{option.value}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Passage Fill in the Blanks */}
                                        {part.questions.passage_fill_in_the_blanks && (
                                            <div>
                                                <h5 className="font-medium mb-2">
                                                    Passage Fill in the Blanks
                                                </h5>
                                                <div className="p-4 border rounded-lg mb-2">
                                                    <p>{part.questions.passage_fill_in_the_blanks.text}</p>
                                                    <p className="italic mt-2 text-gray-600">
                                                        {part.questions.passage_fill_in_the_blanks.instruction}
                                                    </p>
                                                    <div className="mt-4 space-y-3">
                                                        {part.questions.passage_fill_in_the_blanks.blanks.map(
                                                            (blank: any) => (
                                                                <div
                                                                    key={blank.blank_number}
                                                                    className="flex items-center space-x-3"
                                                                >
                                                                    <span className="font-bold">
                                                                        Blank {blank.blank_number}:
                                                                    </span>
                                                                    <input
                                                                        type="text"
                                                                        placeholder={"Write the answer here"}
                                                                        className="input input-bordered w-full"
                                                                    />
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
        </div>
    );
}
