"use client";

import React, { useState } from "react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [topic, setTopic] = useState("Tickets & group bookings");
  const [message, setMessage] = useState("");
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

    if (!name) {
      setStatus("error");
      setErrorMessage("Please enter your full name.");
      return;
    }

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

    if (!topic) {
      setStatus("error");
      setErrorMessage("Please select what you are getting in touch about.");
      return;
    }

    if (!message) {
      setStatus("error");
      setErrorMessage("Please enter your message.");
      return;
    }

    setStatus("loading");

    try {
      const portalId = "148257610";
      const formId = "1369024b-f128-4722-b54a-c388fecb2b8c";
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

      // Optional: Fetch IP address to avoid HubSpot analytics warnings
      let ipAddress = "";
      try {
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        if (ipResponse.ok) {
          const ipData = await ipResponse.json();
          ipAddress = ipData.ip;
        }
      } catch (e) {
        console.warn("Could not fetch IP address for HubSpot context", e);
      }

      // Split name into first and last name
      const trimmedName = name.trim();
      const firstSpaceIndex = trimmedName.indexOf(" ");
      const firstName = firstSpaceIndex === -1 ? trimmedName : trimmedName.substring(0, firstSpaceIndex);
      const lastName = firstSpaceIndex === -1 ? "" : trimmedName.substring(firstSpaceIndex + 1).trim();

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: [
            {
              objectTypeId: "0-1",
              name: "firstname",
              value: firstName,
            },
            {
              objectTypeId: "0-1",
              name: "lastname",
              value: lastName,
            },
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
              name: "im_getting_in_touch_about",
              value: topic,
            },
            {
              objectTypeId: "0-1",
              name: "message",
              value: message,
            },
          ],
          context: {
            pageUri: typeof window !== "undefined" ? window.location.href : "",
            pageName: typeof window !== "undefined" ? document.title : "",
            ...(hutk ? { hutk } : {}),
            ...(ipAddress ? { ipAddress } : {}),
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit to HubSpot");
      }

      setStatus("success");
      setName("");
      setEmail("");
      setCompany("");
      setTopic("Tickets & group bookings");
      setMessage("");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMessage("Unable to submit. Please check your connection and try again.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "650px" }}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {status !== "success" ? (
          <>
            <h2 className="modal-title">Send us a message</h2>
            <p className="modal-subtitle">
              Tell us what you need and we'll get back to you
            </p>

            <form onSubmit={handleSubmit}>
              <div className="modal-form-group">
                <label className="modal-label">
                  Full name <span className="required">*</span>
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
                  required
                />
              </div>

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
                  Company / property (optional)
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
                />
              </div>

              <div className="modal-form-group">
                <label className="modal-label">
                  I'm getting in touch about... <span className="required">*</span>
                </label>
                <select
                  className="modal-input"
                  value={topic}
                  onChange={(e) => {
                    setTopic(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  disabled={status === "loading"}
                  style={{
                    appearance: "none",
                    WebkitAppearance: "none",
                    backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right center",
                    paddingRight: "24px",
                    cursor: "pointer"
                  }}
                  required
                >
                  <option value="Tickets & group bookings">Tickets & group bookings</option>
                  <option value="Sponsorship">Sponsorship</option>
                  <option value="Partnerships & media">Partnerships & media</option>
                  <option value="Something else">Something else</option>
                </select>
              </div>

              <div className="modal-form-group">
                <label className="modal-label">
                  Message <span className="required">*</span>
                </label>
                <textarea
                  className="modal-input"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  disabled={status === "loading"}
                  rows={3}
                  style={{ resize: "vertical", minHeight: "60px" }}
                  required
                />
              </div>

              {status === "error" && (
                <div className="error-msg" style={{ paddingLeft: 0, marginBottom: "12px", marginTop: 0 }}>
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                className="sponsor-submit-btn"
                disabled={status === "loading"}
                style={{ marginTop: "24px" }}
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
                    Send a message
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 8H15M15 8L9 2M15 8L9 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>
            </form>
            <p className="modal-footer-text" style={{ fontSize: "0.85rem", opacity: 0.8, marginTop: "16px" }}>
              We usually reply within 1 business day.
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
            <h2 className="success-title">Message Sent!</h2>
            <p className="success-message" style={{ marginBottom: "28px" }}>
              Thank you for reaching out. We have received your message and will get back to you within 1 business day.
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
