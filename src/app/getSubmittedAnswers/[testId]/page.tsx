'use client'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

// Define TypeScript interfaces for the data structure
interface Submission {
    _id: string
    userId: string
    testId: string
    answers: Answer[]
    submittedAt: string
    totalScore: number
    __v: number
}

interface Answer {
    questionId: number | any[] // Can be a number or array for grouped questions
    value?: string // User's answer
    answers?: any[] // For grouped questions, often empty in the sample
    answerText: string | any[] // Correct answer(s)
    isCorrect: boolean
}

const SubmissionPage = () => {
    const Params = useParams() // Get testId from URL params
    const { testId } = Params;
    const [submission, setSubmission] = useState<Submission | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    console.log(testId, 'submissionId')

    // Fetch submission data when submissionId changes
    useEffect(() => {
        const fetchSubmission = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/submitAnswers/submitReadingAnswers/${testId}`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    }
                )
                const response = await res.json()
                console.log("Response", response)
                if (response.success) {
                    // Assuming the API returns an array, take the first submission
                    // Adjust if the endpoint returns a single object
                    setSubmission(Array.isArray(response.data) ? response.data[0] : response.data)
                } else {
                    setError('Failed to fetch submission data')
                }
            } catch (err) {
                setError('An error occurred while fetching data')
            } finally {
                setLoading(false)
            }
        }

        if (testId) {
            fetchSubmission()
        }
    }, [testId])

    // Handle loading and error states
    if (loading) return <div className="text-center p-4">Loading...</div>
    if (error) return <div className="text-center p-4 text-error">{error}</div>
    if (!submission) return <div className="text-center p-4">No submission data available</div>

    // Filter answers to include only those with questionId as a number (individual answers)
    const individualAnswers = submission.answers
        .filter((answer): answer is Answer & { questionId: number } => typeof answer.questionId === 'number')
        .sort((a, b) => a.questionId - b.questionId)

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Your Submitted Answers</h1>

            {/* Total Score Card */}
            <div className="card bg-base-100 shadow-xl mb-6">
                <div className="card-body">
                    <h2 className="card-title">Total Score: {submission.totalScore} / 40</h2>
                    <p>Submitted at: {new Date(submission.submittedAt).toLocaleString()}</p>
                </div>
            </div>

            {/* Answers Table */}
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Question</th>
                            <th>Your Answer</th>
                            <th>Correct Answer</th>
                            <th>Correct</th>
                        </tr>
                    </thead>
                    <tbody>
                        {individualAnswers.map((answer, index) => (
                            <tr key={index}>
                                <td>{answer.questionId}</td>
                                <td>{answer.value || 'Not answered'}</td>
                                <td>{answer.answerText as string}</td>
                                <td className={answer.isCorrect ? 'text-success' : 'text-error'}>
                                    {answer.isCorrect ? '✅' : '❌'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default SubmissionPage