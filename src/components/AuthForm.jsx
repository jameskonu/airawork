import React, { useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default function AuthForm() {
  const [isRegister, setIsRegister] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [referral, setReferral] = useState("");
  const [error, setError] = useState("");
  const isValidPhone = phone => /^0\d{9}$/.test(phone);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!isValidPhone(phone)) return setError("Phone must start with 0 and have 10 digits");
    if (password.length !== 6) return setError("Password must be 6 characters");
    if (isRegister && password !== confirm) return setError("Passwords do not match");
    const email = phone + "@aira.com";
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
        // TODO: Save referral, IP, etc. to Firestore here
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      window.location.href = "/dashboard";
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="neu-card w-full max-w-xs">
        <h2 className="text-center font-bold text-2xl mb-4" style={{ color: "#4f8cff" }}>
          {isRegister ? "Register" : "Login"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            className="neu-input"
            placeholder="Phone (0XXXXXXXXX)"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
            maxLength={10}
            type="tel"
          />
          <div className="relative">
            <input
              className="neu-input pr-10"
              type={show ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              maxLength={6}
              autoComplete="new-password"
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
          {isRegister && (
            <>
              <input
                className="neu-input"
                type={show ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                minLength={6}
                maxLength={6}
                autoComplete="new-password"
              />
              <input
                className="neu-input"
                placeholder="Referral code (optional)"
                value={referral}
                onChange={e => setReferral(e.target.value)}
                readOnly={!!referral}
              />
            </>
          )}
          <button className="neu-btn mt-2" type="submit">
            {isRegister ? "Register" : "Login"}
          </button>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        </form>
        <div className="mt-4 flex flex-col items-center">
          <button
            className="text-blue-500 underline text-sm"
            style={{ background: "none", border: "none" }}
            onClick={() => setIsRegister(s => !s)}
          >
            {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
          </button>
          {!isRegister && (
            <div className="mt-2 text-blue-500 text-xs text-center">Forgot password? Contact support</div>
          )}
        </div>
      </div>
    </div>
  );
}