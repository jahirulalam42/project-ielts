import React from 'react'
import listeningTests from '../../../../data/listening.json';
import Link from 'next/link';

const page: React.FC = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold text-center mb-8 text-primary">
                IELTS Listening Tests
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listeningTests.listeningTests.map((test) => (
                    <div
                        key={test.id}
                        className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-200"
                    >
                        <div className="card-body">
                            <h2 className="card-title text-2xl mb-2">{test.title}</h2>
                            <p className="text-gray-600 mb-4">{test.description}</p>

                            <div className="flex items-center gap-2 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-info" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm1-8a1 1 0 10-2 0v3a1 1 0 00.293.707l1.414 1.414a1 1 0 001.414-1.414L11 11V8z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">Duration: {test.duration} minutes</span>
                            </div>

                            <div className="card-actions justify-end">
                                <Link
                                    href={`/listening/${test.id}`}
                                    className="btn btn-primary w-full"
                                >
                                    Start Test
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {listeningTests.listeningTests.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-2xl text-gray-500 mb-4">
                        No listening tests available
                    </div>
                    <div className="text-gray-400">
                        Check back later for new tests
                    </div>
                </div>
            )}
        </div>
    )
}

export default page
