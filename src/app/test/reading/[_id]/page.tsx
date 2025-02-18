import { Clock, BookOpen, ListChecks } from 'lucide-react';

const Page = async ({ params }: { params: { _id: string } }) => {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/readingQuestions/${params._id}`
    );
    if (!response.ok) throw new Error('Failed to fetch test data');
    const Data = await response.json();
    const testData = Data.data;

    console.log(Data)

    return (
        <div className="min-h-screen bg-base-100">
            {/* Test Header */}
            <div className="navbar bg-base-100 shadow-lg px-8">
                <div className="flex-1">
                    <h1 className="text-2xl font-bold">
                        {testData.title}
                    </h1>
                </div>
                <div className="flex-none gap-4">
                    <button className="btn btn-info">
                        <Clock className="w-4 h-4" />
                        <span className="ml-2">Time: {testData.duration}:00</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto p-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Passage Column */}
                    <div className="flex-grow lg:w-2/3">
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <div className="flex items-center gap-2 mb-6">
                                    <BookOpen className="w-6 h-6 text-primary" />
                                    <h2 className="card-title text-2xl">Reading Passage</h2>
                                </div>

                                {testData.parts?.map((part: any) => (
                                    <div key={part._id} className="space-y-4">
                                        <div className="divider text-xl font-semibold before:bg-neutral after:bg-neutral">
                                            {part.title}
                                        </div>
                                        <div className="prose max-w-none">
                                            {part.passage.split('\n')?.map((paragraph: string, idx: number) => (
                                                <p key={idx} className="mb-4">{paragraph}</p>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Questions Column */}
                    <div className="lg:w-1/3">
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <div className="flex items-center gap-2 mb-6">
                                    <ListChecks className="w-6 h-6 text-primary" />
                                    <h2 className="card-title text-2xl">Questions</h2>
                                </div>

                                <form className="space-y-8">
                                    {testData.parts?.map((part: any) => (
                                        <div key={part._id} className="space-y-6">
                                            <h3 className="text-lg font-semibold">{part.title} Questions</h3>
                                            <div className="space-y-4">
                                                {part.questions?.map((question: any) => (
                                                    <div key={question._id} className="form-control">
                                                        <label className="label">
                                                            <span className="label-text font-medium">
                                                                Question {question.number}
                                                            </span>
                                                        </label>
                                                        {question.text && (
                                                            <p className="text-sm mb-2">{question.text}</p>
                                                        )}
                                                        <div className="space-y-2">
                                                            {question.options?.map((option: string, idx: number) => (
                                                                <label
                                                                    key={idx}
                                                                    className="flex items-center gap-4 p-3 bg-base-200 rounded-box cursor-pointer hover:bg-base-300"
                                                                >
                                                                    <input
                                                                        type="radio"
                                                                        name={`q-${question.id}`}
                                                                        className="radio radio-primary"
                                                                    />
                                                                    <span className="flex-1">{option}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    <div className="divider"></div>
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-block"
                                    >
                                        Submit Answers
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;