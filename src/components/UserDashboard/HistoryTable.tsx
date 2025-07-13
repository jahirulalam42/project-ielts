import React, { useState } from 'react'
import { FaHistory } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import SubmissionResultModal from './SubmissionResultModal';

const HistoryTable = ({ selectedSkill, testHistory }: any) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
    const { data: session } = useSession();

    const handleShowResult = (testId: string) => {
        setSelectedTestId(testId);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedTestId(null);
    };

    return (
        <div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Latest 10 Test History
                    </h3>
                </div>
                <div className="p-1">
                    <table className="table-auto w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="py-3 px-4 text-left text-gray-600 text-sm">
                                    Test
                                </th>
                                <th className="py-3 px-4 text-center text-gray-600 text-sm">
                                    Date
                                </th>
                                <th className="py-3 px-4 text-center text-gray-600 text-sm">
                                    Total Score
                                </th>
                                <th className="py-3 px-4 text-center text-gray-600 text-sm">
                                    Show Result
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {testHistory.map((test: any) => {
                                const totalScore = test[selectedSkill] !== undefined ? test[selectedSkill] : '--';
                                return (
                                    <tr key={test.id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium text-gray-800">
                                            {test.id.slice(-6)}
                                        </td>
                                        <td className="py-3 px-4 text-center text-gray-600 text-sm">
                                            {new Date(test.date).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </td>
                                        <td className="py-3 px-4 text-center font-bold text-gray-900">
                                            {totalScore}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <button className="btn btn-sm btn-primary" onClick={() => handleShowResult(test.id)}>
                                                Show Result
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {testHistory.length === 0 && (
                        <div className="py-12 text-center text-gray-500">
                            <FaHistory className="mx-auto text-3xl mb-2" />
                            <p>No test history available</p>
                        </div>
                    )}
                </div>
            </div>
            {/* Modal overlay */}
            {modalOpen && selectedTestId && session?.user?.id && (
                <SubmissionResultModal
                    testId={selectedTestId}
                    userId={session.user.id}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    )
}

export default HistoryTable
