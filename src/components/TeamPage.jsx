import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Mock async backend fetch
async function fetchTeamStats() {
  return {
    totalMembers: 16,
    totalEarnings: 1200,
    levelStats: [
      { level: 1, count: 5, earnings: 600 },
      { level: 2, count: 7, earnings: 400 },
      { level: 3, count: 4, earnings: 200 },
    ],
    chartData: {
      labels: ["Level 1", "Level 2", "Level 3"],
      earnings: [600, 400, 200],
      members: [5, 7, 4],
    },
  };
}

async function fetchTeamMembers() {
  // Each member: { name, phone, joined, earnings, level }
  return [
    { name: "Alice", phone: "0700123123", joined: "2025-07-10", earnings: 200, level: 1 },
    { name: "Bob", phone: "0720123456", joined: "2025-07-07", earnings: 100, level: 1 },
    { name: "Cathy", phone: "0730456789", joined: "2025-07-09", earnings: 50, level: 2 },
    { name: "David", phone: "0712345678", joined: "2025-07-08", earnings: 70, level: 2 },
    { name: "Eve", phone: "0740234567", joined: "2025-07-11", earnings: 80, level: 3 },
    // Add more...
  ];
}

export default function TeamPage() {
  const myCode = "AIRA1234";
  const [copied, setCopied] = useState(false);
  const [teamStats, setTeamStats] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [expanded, setExpanded] = useState({1: true, 2: false, 3: false});

  useEffect(() => {
    // Replace with real backend calls.
    fetchTeamStats().then(setTeamStats);
    fetchTeamMembers().then(setTeamMembers);
  }, []);

  function copyCode() {
    navigator.clipboard.writeText(myCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (!teamStats) return <div className="text-center mt-8">Loading team stats...</div>;

  // Prepare Chart.js data
  const chartData = {
    labels: teamStats.chartData.labels,
    datasets: [
      {
        label: "Earnings (KES)",
        data: teamStats.chartData.earnings,
        backgroundColor: ["#2196f3", "#4f8cff", "#7faaff"],
        borderRadius: 10,
      },
      {
        label: "Members",
        data: teamStats.chartData.members,
        backgroundColor: ["#e0e5ec88", "#b2c7e688", "#f5faff88"],
        borderRadius: 10,
        yAxisID: "y1"
      }
    ]
  };
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" }
    },
    scales: {
      y: { beginAtZero: true },
      y1: {
        beginAtZero: true,
        position: "right",
        grid: { drawOnChartArea: false }
      }
    }
  };

  // Group members by level
  const levels = [1, 2, 3];
  const membersByLevel = levels.map(level => teamMembers.filter(m => m.level === level));

  return (
    <div className="min-h-screen flex flex-col items-center py-8" style={{background: "#e3efff"}}>
      <div className="w-full max-w-xs">
        {/* Invite code */}
        <div className="neu-card mb-4">
          <h2 className="text-xl font-bold text-center mb-3" style={{color: "#2196f3"}}>My Team</h2>
          <div className="mb-2 text-center">
            <div className="text-gray-600 text-sm mb-1">Your invite code:</div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="font-mono px-2 py-1 rounded bg-blue-50 border border-blue-200 select-all">{myCode}</span>
              <button
                className="neu-btn px-3 py-1 text-xs"
                type="button"
                onClick={copyCode}
                style={{minWidth: 70}}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="text-xs text-blue-500">
              Share this code with friends to earn referral rewards!
            </div>
          </div>
        </div>
        {/* Stats */}
        <div className="neu-card mb-4">
          <div className="flex flex-col items-center mb-3">
            <div className="flex gap-4 w-full justify-around">
              <div className="text-center">
                <div className="font-semibold text-blue-600 text-lg">{teamStats.totalMembers}</div>
                <div className="text-xs text-gray-500">Total Members</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-blue-600 text-lg">KES {teamStats.totalEarnings}</div>
                <div className="text-xs text-gray-500">Referral Earned</div>
              </div>
            </div>
          </div>
          <Bar data={chartData} options={chartOptions} height={170}/>
        </div>
        {/* Level breakdowns */}
        {levels.map(level => (
          <div key={level} className="neu-card mb-4">
            <button
              className="w-full text-left font-semibold text-blue-700 flex justify-between items-center"
              style={{background: "none", border: "none", fontSize: "1rem", padding: 0}}
              onClick={() => setExpanded(e => ({...e, [level]: !e[level]}))}
            >
              <span>
                Level {level} ({teamStats.levelStats.find(l => l.level === level)?.count || 0} members)
              </span>
              <span style={{fontSize: 20}}>{expanded[level] ? "▲" : "▼"}</span>
            </button>
            {expanded[level] && (
              <div>
                {membersByLevel[level-1].length === 0 ? (
                  <div className="text-sm text-gray-500 text-center py-2">No members at this level.</div>
                ) : (
                  <table className="w-full text-xs mt-2">
                    <thead>
                      <tr className="text-left">
                        <th className="py-1">Name</th>
                        <th className="py-1">Phone</th>
                        <th className="py-1">Joined</th>
                        <th className="py-1">Earned</th>
                      </tr>
                    </thead>
                    <tbody>
                      {membersByLevel[level-1].map((m, i) => (
                        <tr key={i}>
                          <td className="py-1">{m.name}</td>
                          <td className="py-1">{m.phone}</td>
                          <td className="py-1">{m.joined}</td>
                          <td className="py-1">KES {m.earnings}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}