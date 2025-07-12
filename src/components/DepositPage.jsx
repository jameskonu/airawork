import React, { useState } from "react";
import { DEPOSIT_AMOUNTS } from "../constants";

export default function DepositPage() {
  const [amount, setAmount] = useState("");
  const [fundPassword, setFundPassword] = useState("");
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(1);
  const [mpesaMessage, setMpesaMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const mpesaNumber = "0718989672";

  // Call this on submit, then move to next step
  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!amount || !DEPOSIT_AMOUNTS.includes(Number(amount))) {
      setError("Please select or enter a valid deposit amount.");
      return;
    }
    if (fundPassword.length !== 6) {
      setError("Fund password must be 6 digits.");
      return;
    }
    setStep(2);
  }

  function handleMpesaSubmit(e) {
    e.preventDefault();
    setError("");
    if (!mpesaMessage.trim()) {
      setError("Please paste the M-Pesa confirmation message.");
      return;
    }
    setSubmitting(true);
    // TODO: Send deposit request to backend
    setTimeout(() => {
      setSubmitting(false);
      setStep(3);
    }, 1500);
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-8" style={{background: "#e3efff"}}>
      <div className="w-full max-w-xs">
        <div className="neu-card mb-4">
          <h2 className="text-xl font-bold text-center mb-4" style={{color: "#2196f3"}}>Deposit</h2>
          {step === 1 && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <div>
                <div className="text-sm text-gray-600 mb-1">Select amount to deposit:</div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {DEPOSIT_AMOUNTS.map(val => (
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
                  min={1000}
                  max={200000}
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
              <button className="neu-btn mt-2" type="submit">
                Next
              </button>
              {error && <div className="text-red-500 text-center text-sm">{error}</div>}
            </form>
          )}
          {step === 2 && (
            <form onSubmit={handleMpesaSubmit} className="flex flex-col gap-2">
              <div className="text-center text-blue-700 mb-2">
                <div>Go to <b>M-Pesa</b> and send <b>KES {amount}</b> to:</div>
                <div className="text-lg font-bold mt-1" style={{color:"#2196f3"}}>{mpesaNumber}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Paste your M-Pesa confirmation message below:</div>
                <textarea
                  className="neu-input"
                  rows={3}
                  placeholder="e.g. QJD1234 Confirmed. You have received Ksh1,000 from ..."
                  value={mpesaMessage}
                  onChange={e => setMpesaMessage(e.target.value)}
                  required
                />
              </div>
              <button className="neu-btn" type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit"}
              </button>
              {error && <div className="text-red-500 text-center text-sm">{error}</div>}
            </form>
          )}
          {step === 3 && (
            <div className="text-center text-green-600 font-semibold">
              Deposit submitted!<br/>
              Please wait for admin confirmation before your balance is updated.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}