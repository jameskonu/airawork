import React, { useState } from "react";
import { WITHDRAW_AMOUNTS } from "../constants";

export default function WithdrawPage() {
  const [amount, setAmount] = useState("");
  const [fundPassword, setFundPassword] = useState("");
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState([
    // Example withdrawal history; replace with backend data
    // { date: "2025-07-10", amount: 1000, status: "Pending" }
  ]);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!amount || !WITHDRAW_AMOUNTS.includes(Number(amount))) {
      setError("Please select or enter a valid withdrawal amount.");
      return;
    }
    if (fundPassword.length !== 6) {
      setError("Fund password must be 6 digits.");
      return;
    }
    setSubmitting(true);
    // TODO: Send withdrawal request to backend
    setTimeout(() => {
      setSubmitting(false);
      setStep(2);
      // Example: Add to history (simulate)
      setHistory([
        { date: new Date().toISOString().split("T")[0], amount, status: "Pending" },
        ...history,
      ]);
    }, 1500);
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-8" style={{background: "#e3efff"}}>
      <div className="w-full max-w-xs">
        <div className="neu-card mb-4">
          <h2 className="text-xl font-bold text-center mb-4" style={{color: "#2196f3"}}>Withdraw</h2>
          {step === 1 && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <div>
                <div className="text-sm text-gray-600 mb-1">Select withdrawal amount:</div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {WITHDRAW_AMOUNTS.map(val => (
                    <button
                      type="button"
                      key={val}
                      className={`neu-btn ${amount === String(val) ? "neu-active" : ""}`}
                      style={{
                        background: amount === String(val) ? "linear-gradient(90deg,#2196f3,#4f8cff)" : undefined,
                        color: amount === String(val) ? "#fff" : undefined
                      }}
                      onClick={() => setAmount(String(val))}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                <input
                  className="neu-input"
                  type="number"
                  min={500}
                  max={20000}
                  placeholder="Or enter custom amount"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
              </div>
              <div className="relative">
                <input
                  className="neu-input pr-10"
                  type={show ? "text" : "password"}
                  placeholder="Fund password (6 digits)"
                  value={fundPassword}
                  onChange={e => setFundPassword(e.target.value)}
                  required
                  minLength={6}
                  maxLength={6}
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  tabIndex={-1}
                  onClick={() => setShow(s => !s)}
                  style={{ background: "transparent", border: "none" }}
                >
                  {show ? "🙈" : "👁️"}
                </button>
              </div>
              <button className="neu-btn mt-2" type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Withdraw"}
              </button>
              {error && <div className="text-red-500 text-center text-sm">{error}</div>}
            </form>
          )}
          {step === 2 && (
            <div className="text-center text-green-600 font-semibold">
              Withdrawal request submitted!<br/>
              Please wait for admin review and M-Pesa disbursement.
              <div className="mt-4">
                <button className="neu-btn" onClick={() => setStep(1)}>New Withdrawal</button>
              </div>
            </div>
          )}
        </div>
        {/* Withdrawal History */}
        <div className="neu-card mt-6">
          <h3 className="text-blue-600 font-semibold text-center mb-2">Withdrawal History</h3>
          {history.length === 0 ? (
            <div className="text-sm text-gray-500 text-center">No withdrawal records yet.</div>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left">
                  <th className="py-1">Date</th>
                  <th className="py-1">Amount</th>
                  <th className="py-1">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => (
                  <tr key={i}>
                    <td className="py-1">{h.date}</td>
                    <td className="py-1">{h.amount}</td>
                    <td className="py-1">{h.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}