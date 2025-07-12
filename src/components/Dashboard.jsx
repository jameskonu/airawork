import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  // Replace these with real user data from backend
  const userName = "Hi, User!";
  const balance = 0;
  const earnings = {
    today: 0,
    yesterday: 0,
    week: 0,
    month: 0,
    total: 0,
    referral: 0,
    taskMgmt: 0,
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-4" style={{background: "#e3efff"}}>
      <div className="w-full max-w-xs">
        {/* Header with greeting and gift icon */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-semibold" style={{color: "#4f8cff"}}>{userName}</span>
          <Link to="/gift" className="neu-card flex items-center justify-center p-2" style={{width: 38, height: 38}}>
            <span role="img" aria-label="gift" style={{fontSize: 22}}>🎁</span>
          </Link>
        </div>

        {/* Balance Card */}
        <div className="neu-card mb-4 flex flex-col items-center">
          <div className="text-xs text-gray-500">Balance (KES)</div>
          <div className="text-3xl font-bold mb-1" style={{color: "#2196f3"}}>{balance}</div>
          <div className="flex gap-2 mt-2 w-full">
            <Link to="/deposit" className="neu-btn flex-1 text-center">Deposit</Link>
            <Link to="/withdraw" className="neu-btn flex-1 text-center">Withdraw</Link>
          </div>
        </div>

        {/* Earnings Overview */}
        <div className="neu-card mb-4 grid grid-cols-2 gap-2 text-center text-sm">
          <div>
            <div className="font-semibold" style={{color:"#4f8cff"}}>Today</div>
            <div>{earnings.today}</div>
          </div>
          <div>
            <div className="font-semibold" style={{color:"#4f8cff"}}>Yesterday</div>
            <div>{earnings.yesterday}</div>
          </div>
          <div>
            <div className="font-semibold" style={{color:"#4f8cff"}}>This Week</div>
            <div>{earnings.week}</div>
          </div>
          <div>
            <div className="font-semibold" style={{color:"#4f8cff"}}>This Month</div>
            <div>{earnings.month}</div>
          </div>
          <div>
            <div className="font-semibold" style={{color:"#4f8cff"}}>Total</div>
            <div>{earnings.total}</div>
          </div>
          <div>
            <div className="font-semibold" style={{color:"#4f8cff"}}>Referral</div>
            <div>{earnings.referral}</div>
          </div>
          <div>
            <div className="font-semibold" style={{color:"#4f8cff"}}>Task Mgmt</div>
            <div>{earnings.taskMgmt}</div>
          </div>
        </div>

        {/* Main Actions */}
        <div className="flex flex-col gap-3">
          <Link className="neu-btn text-center" to="/tasks/intern">Go to Tasks</Link>
          <Link className="neu-card flex items-center justify-between p-3" to="/invite">
            <span className="font-semibold" style={{color:"#4f8cff"}}>Invite & Earn</span>
            <span role="img" aria-label="invite" style={{fontSize:20}}>🤝</span>
          </Link>
          <Link className="neu-card flex items-center justify-between p-3" to="/income">
            <span className="font-semibold" style={{color:"#4f8cff"}}>Income Details</span>
            <span role="img" aria-label="income" style={{fontSize:20}}>📊</span>
          </Link>
          <Link className="neu-card flex items-center justify-between p-3" to="/settings">
            <span className="font-semibold" style={{color:"#4f8cff"}}>Settings</span>
            <span role="img" aria-label="settings" style={{fontSize:20}}>⚙️</span>
          </Link>
        </div>
      </div>
    </div>
  );
}