import React, { useState } from "react";

export default function SettingsPage() {
  // Simulate user info (replace with backend integration)
  const [mpesaName, setMpesaName] = useState("");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [fundPassword, setFundPassword] = useState("");
  const [fundPasswordRepeat, setFundPasswordRepeat] = useState("");
  const [showFund, setShowFund] = useState(false);

  const [currentLoginPw, setCurrentLoginPw] = useState("");
  const [newLoginPw, setNewLoginPw] = useState("");
  const [repeatLoginPw, setRepeatLoginPw] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  const [successFund, setSuccessFund] = useState("");
  const [successLogin, setSuccessLogin] = useState("");
  const [errorFund, setErrorFund] = useState("");
  const [errorLogin, setErrorLogin] = useState("");

  function handleFundSubmit(e) {
    e.preventDefault();
    setSuccessFund(""); setErrorFund("");
    if (!mpesaName.trim()) return setErrorFund("Please enter your M-Pesa name.");
    if (!/^0\d{9}$/.test(mpesaPhone)) return setErrorFund("Phone must start with 0 and have 10 digits.");
    if (fundPassword.length !== 6) return setErrorFund("Fund password must be 6 digits.");
    if (fundPassword !== fundPasswordRepeat) return setErrorFund("Passwords do not match.");
    // TODO: Save fund password and M-Pesa info to backend
    setSuccessFund("Fund password and M-Pesa info saved!");
  }

  function handleLoginPwSubmit(e) {
    e.preventDefault();
    setSuccessLogin(""); setErrorLogin("");
    if (!currentLoginPw || !newLoginPw || !repeatLoginPw) return setErrorLogin("All fields required.");
    if (newLoginPw.length !== 6) return setErrorLogin("New password must be 6 characters.");
    if (newLoginPw !== repeatLoginPw) return setErrorLogin("Passwords do not match.");
    // TODO: Change login password in backend
    setSuccessLogin("Login password changed!");
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-8" style={{background: "#e3efff"}}>
      <div className="w-full max-w-xs">
        {/* Fund Password & M-Pesa Info */}
        <div className="neu-card mb-6">
          <h2 className="text-lg font-bold mb-3 text-center" style={{color: "#2196f3"}}>Set Fund Password</h2>
          <form onSubmit={handleFundSubmit} className="flex flex-col gap-2">
            <input
              className="neu-input"
              placeholder="M-Pesa Name"
              value={mpesaName}
              onChange={e => setMpesaName(e.target.value)}
              required
              autoComplete="name"
            />
            <input
              className="neu-input"
              placeholder="M-Pesa Number (0XXXXXXXXX)"
              value={mpesaPhone}
              onChange={e => setMpesaPhone(e.target.value)}
              required
              maxLength={10}
              type="tel"
              autoComplete="tel"
            />
            <div className="relative">
              <input
                className="neu-input pr-10"
                type={showFund ? "text" : "password"}
                placeholder="Fund Password (6 digits)"
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
                onClick={() => setShowFund(s => !s)}
                style={{ background: "transparent", border: "none" }}
              >
                {showFund ? "🙈" : "👁️"}
              </button>
            </div>
            <input
              className="neu-input"
              type={showFund ? "text" : "password"}
              placeholder="Repeat Fund Password"
              value={fundPasswordRepeat}
              onChange={e => setFundPasswordRepeat(e.target.value)}
              required
              minLength={6}
              maxLength={6}
              inputMode="numeric"
              pattern="[0-9]*"
            />
            <button className="neu-btn mt-2" type="submit">Save</button>
            {successFund && <div className="text-green-600 text-center text-sm">{successFund}</div>}
            {errorFund && <div className="text-red-500 text-center text-sm">{errorFund}</div>}
          </form>
        </div>
        {/* Change Login Password */}
        <div className="neu-card">
          <h2 className="text-lg font-bold mb-3 text-center" style={{color: "#2196f3"}}>Change Login Password</h2>
          <form onSubmit={handleLoginPwSubmit} className="flex flex-col gap-2">
            <div className="relative">
              <input
                className="neu-input pr-10"
                type={showLogin ? "text" : "password"}
                placeholder="Current Password"
                value={currentLoginPw}
                onChange={e => setCurrentLoginPw(e.target.value)}
                required
                minLength={6}
                maxLength={6}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                tabIndex={-1}
                onClick={() => setShowLogin(s => !s)}
                style={{ background: "transparent", border: "none" }}
              >
                {showLogin ? "🙈" : "👁️"}
              </button>
            </div>
            <input
              className="neu-input"
              type={showLogin ? "text" : "password"}
              placeholder="New Password (6 digits)"
              value={newLoginPw}
              onChange={e => setNewLoginPw(e.target.value)}
              required
              minLength={6}
              maxLength={6}
            />
            <input
              className="neu-input"
              type={showLogin ? "text" : "password"}
              placeholder="Repeat New Password"
              value={repeatLoginPw}
              onChange={e => setRepeatLoginPw(e.target.value)}
              required
              minLength={6}
              maxLength={6}
            />
            <button className="neu-btn mt-2" type="submit">Change Password</button>
            {successLogin && <div className="text-green-600 text-center text-sm">{successLogin}</div>}
            {errorLogin && <div className="text-red-500 text-center text-sm">{errorLogin}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}