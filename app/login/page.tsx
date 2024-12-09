"use client";

import { useState, useRef } from "react";
import { signIn } from "next-auth/react";
import { FaSpinner } from "react-icons/fa"; // For spinner icons
import Image from "next/image";

export default function Login() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);

  // Refs for OTP inputs to manage focus
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (step === 1) {
      // Handle sending OTP
      setLoadingSend(true);
      try {
        const res = await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        if (!res.ok) {
          const { message } = await res.json();
          setError(message || "Failed to send OTP. Please try again.");
          return;
        }

        setStep(2); // Move to OTP verification step
      } catch (err) {
        setError(err);
      } finally {
        setLoadingSend(false);
      }
    } else if (step === 2) {
      // Handle verifying OTP
      const enteredOtp = otp.join("");
      if (enteredOtp.length < 6) {
        setError("Please enter the complete OTP.");
        return;
      }

      setLoadingVerify(true);
      try {
        const result = await signIn("credentials", {
          redirect: false,
          email,
          otp: enteredOtp,
        });

        if (!result?.ok) {
          setError("Invalid or expired OTP");
        } else {
          window.location.href = "/workouts/current"; // Redirect to a protected page
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoadingVerify(false);
      }
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Allow only digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Ensure only one digit
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, key: string) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-4 z-10">
            <Image
                src="/auth-background.webp"
                alt="Background"
                layout="fill"
                objectFit="cover"
                className="absolute inset-0 z-0"
                priority
            />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md z-20">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h1 className="text-3xl inter-bold font-bold text-center text-gray-800">
            OTP Sign In
          </h1>

          {error && (
            <p className="text-red-500 text-center" aria-live="assertive">
              {error}
            </p>
          )}

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                step === 2 ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              disabled={step === 2}
            />
          </div>

          {/* OTP Input - Reveals smoothly when step === 2 */}
          <div
            className={`transition-opacity duration-500 ${
              step === 2 ? "opacity-100 max-h-40 mt-4" : "opacity-0 max-h-0 overflow-hidden"
            }`}
          >
            <label htmlFor="otp" className="block text-gray-700 mb-1">
              OTP Code
            </label>
            <div className="flex space-x-2 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e.key)}
                  ref={(el) => (otpRefs.current[index] = el)}
                  className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl"
                  disabled={step !== 2}
                />
              ))}
            </div>
            {step === 2 && (
              <p className="text-sm text-gray-600 text-center mt-2">
                We've sent a code to your email
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full flex items-center justify-center p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${
              (loadingSend || loadingVerify) && "cursor-not-allowed opacity-50"
            }`}
            disabled={loadingSend || loadingVerify}
          >
            {step === 1 ? (
              loadingSend ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                "Send Code"
              )
            ) : (
              loadingVerify ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                "Verify Code"
              )
            )}
          </button>
        </form>
      </div>
    </div>
  );
}