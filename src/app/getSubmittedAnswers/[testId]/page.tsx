'use client'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'

const page = () => {

    const Params = useParams()
    const { testId } = Params

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/readingQuestions/${testId}`,
                { cache: "no-store" }
            );
            const response = await res.json();
        }
    }, [])

    console.log(testId)

    return (
        <div>
            Get submitted Answers
        </div>
    )
}

export default page
