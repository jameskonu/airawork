import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { TASK_APPS } from "../constants";

export default function TaskPage() {
  const { jobLevel } = useParams();
  // In production, fetch these details from backend
  const [completed, setCompleted] = useState([]);
  const [installing, setInstalling] = useState("");
  const [message, setMessage] = useState("");

  // Simple logic for available tasks (replace with backend logic per user/job)
  const jobTasks = {
    intern: 4, "job 1": 4, "job 2": 5,
    "job 3": 6, "job 4": 10, "job 5": 15, "job 6": 20,
  };
  const totalTasks = jobTasks[jobLevel?.toLowerCase()] || 4;
  const todaysTasks = TASK_APPS.slice(0, totalTasks);

  function handleInstall(appName) {
    if (installing || completed.includes(appName)) return;
    setInstalling(appName);
    setMessage("");
    setTimeout(() => {
      setCompleted(prev => [...prev, appName]);
      setInstalling("");
      setMessage(`You have completed installing ${appName}!`);
      // TODO: Save task completion to backend
    }, 4000); // 4 seconds
  }

  // Example of task period expiration (replace with real logic)
  const internshipExpired = jobLevel === "intern" && completed.length >= totalTasks /* && date logic here */;
  const canDoTasks = !internshipExpired;

  return (
    <div className="min-h-screen flex flex-col items-center py-4" style={{background: "#e3efff"}}>
      <div className="w-full max-w-xs">
        <div className="neu-card mb-4 flex flex-col items-center">
          <div className="text-lg font-semibold mb-2" style={{color: "#4f8cff"}}>
            {jobLevel?.toUpperCase()} Tasks
          </div>
          <div className="text-sm text-gray-600 mb-2">
            Complete your tasks below. Each installation takes 4 seconds.
          </div>
          {internshipExpired && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-2 text-center">
              Internship expired, please upgrade to continue working with us.
            </div>
          )}
          <ul className="w-full flex flex-col gap-2 mt-2">
            {todaysTasks.map(app => (
              <li key={app} className="neu-card flex justify-between items-center px-3 py-2">
                <span>{app}</span>
                {completed.includes(app) ? (
                  <span className="text-green-500 font-bold">✅</span>
                ) : (
                  <button
                    className={`neu-btn py-1 px-4 ${installing === app ? "neu-active" : ""}`}
                    disabled={!canDoTasks || installing}
                    onClick={() => handleInstall(app)}
                  >
                    {installing === app ? "Installing..." : "Install"}
                  </button>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-3 text-blue-600 text-center text-sm min-h-6">{message}</div>
        </div>
      </div>
    </div>
  );
}