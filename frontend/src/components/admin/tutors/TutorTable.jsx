import React from "react";
import TutorRow from "./TutorRow";

const TutorTable = ({ tutors, onToggleBlock }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th scope="col" className="text-left p-4 font-semibold text-gray-700 text-sm">
                                TUTOR
                            </th>
                            <th scope="col" className="text-left p-4 font-semibold text-gray-700 text-sm">
                                CONTACT
                            </th>
                            <th scope="col" className="text-left p-4 font-semibold text-gray-700 text-sm">
                                STATUS
                            </th>
                            <th scope="col" className="text-left p-4 font-semibold text-gray-700 text-sm">
                                VERIFICATION
                            </th>
                            <th scope="col" className="text-left p-4 font-semibold text-gray-700 text-sm">
                                ACTIONS
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {tutors.length > 0 ? (
                            tutors.map((tutor) => <TutorRow key={tutor._id} tutor={tutor} onToggleBlock={onToggleBlock} />)
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center text-gray-500 py-10 text-sm italic">
                                    No tutors found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TutorTable;
