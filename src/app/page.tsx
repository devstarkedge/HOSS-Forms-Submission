"use client";

import React, { useState } from "react";
import SponsorshipModal from "@/components/SponsorshipModal";
import BecomeSponsorModal from "@/components/BecomeSponsorModal";

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBecomeSponsorOpen, setIsBecomeSponsorOpen] = useState(false);

  const validateEmail = (emailStr: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(emailStr);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email) {
      setStatus("error");
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!validateEmail(email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");

    try {
      const portalId = "148257610";
      const formId = "5fa365ba-30ce-4798-a519-499a85469fe9";
      const region = "eu1";
      const endpoint = `https://api-${region}.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;

      // Retrieve HubSpot tracking cookie if available
      const getCookie = (name: string) => {
        if (typeof document === "undefined") return undefined;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift();
        return undefined;
      };
      
      const hutk = getCookie("hubspotutk");

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: [
            {
              objectTypeId: "0-1",
              name: "email",
              value: email,
            },
          ],
          context: {
            pageUri: typeof window !== "undefined" ? window.location.href : "",
            pageName: typeof window !== "undefined" ? document.title : "",
            ...(hutk ? { hutk } : {}),
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit to HubSpot");
      }

      setStatus("success");
      setEmail("");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMessage("Unable to submit. Please check your connection and try again.");
    }
  };

  return (
    <>
      <header className="navbar">
        <div className="container navbar-container">
          <div className="logo-text">
            HOSS
            <span className="logo-dot"></span>
          </div>
          <nav className="nav-links">
            <button className="nav-link" style={{ cursor: "pointer", border: "none", background: "none" }} onClick={() => setIsBecomeSponsorOpen(true)}>
              Become a Sponsor
            </button>
            <button className="nav-cta" style={{ cursor: "pointer", border: "none" }} onClick={() => setIsModalOpen(true)}>
              Sponsor
            </button>
            <a href="#" className="nav-cta" style={{ backgroundColor: "var(--accent)", color: "var(--accent-dark)", textDecoration: "none" }}>
              Get tickets
            </a>
          </nav>
        </div>
      </header>

      <main className="hero-section">
        <div className="hero-bg-shapes">
        <div className="shape-1"></div>
        <div className="shape-2"></div>
      </div>

      <div className="hero-content container">
        {status !== "success" ? (
          <>
            <h1 className="hero-heading animate-fade-in">Stay up-to-date</h1>
            <p className="hero-subheading animate-fade-in delay-1">
              with Hospitality Social Media Summit
            </p>
            <p className="hero-description animate-fade-in delay-2">
              Be the first to know about speaker reveals, programme updates and
              ticket releases
            </p>

            <div className="animate-fade-in delay-3" style={{ width: "100%" }}>
              <form onSubmit={handleSubscribe} className="subscribe-form-container">
                <input
                  type="email"
                  placeholder="Your e-mail"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  className="email-input"
                  disabled={status === "loading"}
                />
                <button
                  type="submit"
                  className="subscribe-btn"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <>
                      Submitting
                      <svg
                        className="spinner"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                          animation: "spin 1s linear infinite",
                        }}
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeDasharray="32 32"
                          fill="none"
                          strokeLinecap="round"
                        />
                        <style>{`
                          @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                          }
                        `}</style>
                      </svg>
                    </>
                  ) : (
                    <>
                      Subscribe
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 8H15M15 8L9 2M15 8L9 14"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              {status === "error" && (
                <div className="error-msg">{errorMessage}</div>
              )}
            </div>
          </>
        ) : (
          <div className="success-card">
            <div className="success-icon-container">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="checkmark-circle"
                  cx="24"
                  cy="24"
                  r="22"
                  stroke="currentColor"
                  strokeWidth="2.5"
                />
                <path
                  className="checkmark-check"
                  d="M15 24.5L21.5 31L33 18"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="success-title">You're Subscribed!</h2>
            <p className="success-message">
              Thank you for subscribing to our updates. We will notify you as soon as
              speakers are announced, updates are available, or tickets go on sale!
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="subscribe-btn"
              style={{ margin: "24px auto 0 auto", fontSize: "0.95rem" }}
            >
              Back to Form
            </button>
          </div>
        )}
      </div>
      </main>

      <SponsorshipModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <BecomeSponsorModal isOpen={isBecomeSponsorOpen} onClose={() => setIsBecomeSponsorOpen(false)} />
    </>
  );
}
