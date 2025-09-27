import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { ambassadors } from '../data/ambassadors';
import '../styles/ScoreboardPage.css';

function ScoreboardPage() {
    const [scoreboard, setScoreboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const calculateScores = async () => {
            try {
                const db = getFirestore();
                const usersCollection = collection(db, 'users');
                const userSnapshot = await getDocs(usersCollection);

                const referrals = userSnapshot.docs
                    .map(doc => doc.data().referralCode)
                    .filter(code => code); 

                const referralCounts = referrals.reduce((acc, code) => {
                    const lowerCaseCode = code.toLowerCase();
                    acc[lowerCaseCode] = (acc[lowerCaseCode] || 0) + 1;
                    return acc;
                }, {});

                const calculatedScoreboard = ambassadors.map(ambassador => ({
                    ...ambassador,
                    score: referralCounts[ambassador.id.toLowerCase()] || 0,
                }));
                
                // First, sort by score in descending order
                calculatedScoreboard.sort((a, b) => b.score - a.score);

                // --- NEW LOGIC TO HANDLE TIE-RANKING ---
                let rank = 0;
                let lastScore = -1; // A score that's impossible to have
                const rankedScoreboard = calculatedScoreboard.map((ambassador, index) => {
                    // If the score is different from the last one, this is a new rank
                    if (ambassador.score !== lastScore) {
                        rank = index + 1;
                        lastScore = ambassador.score;
                    }
                    // Add the rank to the ambassador object
                    return { ...ambassador, rank };
                });

                setScoreboard(rankedScoreboard);

            } catch (err) {
                setError('Failed to calculate scores. Please check your Firestore rules.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        calculateScores();
    }, []);

    if (loading) return <div className="scoreboard-container"><p>Calculating scores...</p></div>;
    if (error) return <div className="scoreboard-container"><p className="error-message">{error}</p></div>;

    return (
        <div className="scoreboard-container">
            <h1>Ambassador Scoreboard</h1>
            <table className="scoreboard-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>College</th>
                        <th>Count</th>
                    </tr>
                </thead>
                <tbody>
                    {/* The map function now uses the pre-calculated rank */}
                    {scoreboard.map(ambassador => (
                        <tr key={ambassador.id}>
                            <td className="rank-cell">{ambassador.rank}</td>
                            <td>{ambassador.name}</td>
                            <td>{ambassador.college}</td>
                            <td className="score-cell">{ambassador.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ScoreboardPage;