import React, { useState, useEffect } from 'react';
import { ambassadors } from '../data/ambassadors';
import '../styles/ScoreboardPage.css';

function ScoreboardPage() {
    const [scoreboard, setScoreboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const calculateScores = async () => {
            try {
                // --- HARDCODED DATA START ---
                // Manually added referral data since the MakeMyPass API key is unavailable.
                const hardcodedReferrals = [
                    'AUR011', 'AUR011', 'AUR011', 'AUR011', 'AUR011', 'AUR011',
                    'AUR011', 'AUR011', 'AUR011', 'AUR011', 'AUR011', 'AUR011', 
                    'AUR011', 'AUR011', 'AUR011', 'AUR011', 'AUR011', 'AUR011',
                    'AUR011', 'AUR011', 'AUR011', 'AUR011', 'AUR011', 'AUR011',
                    'AUR011', 'AUR011', 'AUR011', 'AUR011', 'AUR011', 'AUR011',
                    'AUR011', 'AUR011', 'AUR011', 'AUR011', 'AUR011', 'AUR011',
                    'AUR011', 'AUR011',
                    //for now 12 Oct 14:00 AUR011 38 nos. every other 0
                    // Add more referral codes here to simulate data
                ];
                
                // --- FETCH DATA FROM MAKEMYPASS.COM (COMMENTED OUT) ---
                /* // Replace with the actual API endpoint from makemypass.com
                const response = await fetch('https://api.makemypass.com/your-event/referrals');
                const referralData = await response.json();
                // This part depends on the structure of the data from makemypass.com
                const referrals = referralData; // Adjust this based on the actual API response
                */
                // ----------------------------------------------------

                // --- USE HARDCODED DATA FOR NOW ---
                const referrals = hardcodedReferrals;

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
                // Modified error message for local calculation failure
                setError('Failed to calculate scores from available data.');
                console.error("Error in calculateScores:", err);
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
            <h1>Campus Ambassadors Leaderboard</h1>
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
