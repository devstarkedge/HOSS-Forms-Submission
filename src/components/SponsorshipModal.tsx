"use client";

import React, { useState } from "react";

interface SponsorshipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SponsorshipModal({ isOpen, onClose }: SponsorshipModalProps) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const validateEmail = (emailStr: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(emailStr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email) {
      setStatus("error");
      setErrorMessage("Please enter your work email.");
      return;
    }

    if (!validateEmail(email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!company) {
      setStatus("error");
      setErrorMessage("Please enter your company name.");
      return;
    }

    setStatus("loading");

    try {
      const portalId = "148257610";
      const formId = "455dfa10-033e-4f85-8367-c870fc8566fc";
      const region = "eu1";
      const endpoint = `https://api-${region}.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;

      // Retrieve HubSpot tracking cookie if available
      const getCookie = (cookieName: string) => {
        if (typeof document === "undefined") return undefined;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${cookieName}=`);
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
            {
              objectTypeId: "0-1",
              name: "company",
              value: company,
            },
            {
              objectTypeId: "0-1",
              name: "firstname",
              value: name,
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
      setCompany("");
      setName("");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMessage("Unable to submit. Please check your connection and try again.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {status !== "success" ? (
          <>
            <h2 className="modal-title">Get the sponsorship deck</h2>
            <p className="modal-subtitle">
              Enter your work email to receive the full partnership options and pricing.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="modal-form-group">
                <label className="modal-label">
                  Work email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  className="modal-input"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  disabled={status === "loading"}
                  required
                />
              </div>

              <div className="modal-form-group">
                <label className="modal-label">
                  Company <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="modal-input"
                  value={company}
                  onChange={(e) => {
                    setCompany(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  disabled={status === "loading"}
                  required
                />
              </div>

              <div className="modal-form-group">
                <label className="modal-label">
                  Name (optional)
                </label>
                <input
                  type="text"
                  className="modal-input"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  disabled={status === "loading"}
                />
              </div>

              {status === "error" && (
                <div className="error-msg" style={{ paddingLeft: 0, marginBottom: "12px", marginTop: 0 }}>
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                className="modal-submit-btn"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <>
                    Sending
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
                    </svg>
                  </>
                ) : (
                  <>
                    Send me the deck
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 8H15M15 8L9 2M15 8L9 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            <p className="modal-footer-text">
              We'll email the deck within minutes.<br />
              No spam — just partnership information.
            </p>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div className="success-icon-container" style={{ marginBottom: "20px" }}>
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
            <h2 className="modal-title">Deck Sent!</h2>
            <p className="success-message" style={{ marginBottom: "28px" }}>
              Thank you for your interest! The sponsorship deck is on its way to your inbox.
            </p>
            <button
              onClick={onClose}
              className="subscribe-btn"
              style={{ margin: "0 auto", fontSize: "0.95rem" }}
            >
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
