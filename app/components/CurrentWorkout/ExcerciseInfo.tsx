import { useState } from 'react';

export default function ExcerciseInfo({ name, details, lastWeekData }) {
    const [activeTab, setActiveTab] = useState('details');

    // Helper function to round down to the nearest 2.5
    const roundDownToNearest2_5 = (num) => {
        return Math.floor(num / 2.5) * 2.5;
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent z-50">
            <div className="bg-background text-primary-text w-3/4 max-w-md p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center pb-3 mb-3">
                    <h2 className="inter-bold text-xl text-secondary-text">{name}</h2>
                </div>

                {/* Tab Navigation */}
                <div className="flex space-x-4 border-b mb-4">
                    <button
                        className={`py-2 px-4 ${
                            activeTab === 'details' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-primary-text'
                        }`}
                        onClick={() => setActiveTab('details')}
                    >
                        Details
                    </button>
                    <button
                        className={`py-2 px-4 ${
                            activeTab === 'lastWeek' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-primary-text'
                        }`}
                        onClick={() => setActiveTab('lastWeek')}
                    >
                        Last Week
                    </button>
                </div>

                {/* Tab Content */}
                <div className="relative overflow-hidden transition-all duration-500 ease-in-out" style={{ height: '150px' }}>
                    <div
                        className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
                            activeTab === 'details' ? 'translate-x-0' : '-translate-x-full'
                        }`}
                    >
                        <p>{details}</p>
                    </div>
                    <div
                        className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
                            activeTab === 'lastWeek' ? 'translate-x-0' : 'translate-x-full'
                        }`}
                    >
                        {lastWeekData.length > 0 ? (
                            lastWeekData.map((set, index) => {
                                // Check if both recommendedWeight and recommendedReps exist
                                if (!set.recommendedWeight || !set.recommendedReps) return null;

                                // Reverse the weight and reps calculations
                                const lastWeekWeight = roundDownToNearest2_5(set.recommendedWeight / 1.01);
                                const lastWeekReps = set.recommendedReps - 1;

                                return (
                                    <div key={index} className="flex justify-between">
                                        <p>Weight: {lastWeekWeight}kg</p>
                                        <p>Reps: {lastWeekReps}</p>
                                    </div>
                                );
                            })
                        ) : (
                            <p>No data for last week</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}