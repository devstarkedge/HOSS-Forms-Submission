"use client";

import React, { useState } from "react";

interface CityNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  city?: string;
}

export default function CityNotificationModal({ isOpen, onClose, city = "" }: CityNotificationModalProps) {
  const [email, setEmail] = useState("");
  const [selectedCityValue, setSelectedCityValue] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const validateEmail = (emailStr: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(emailStr);
  };

  const activeCity = city || selectedCityValue;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!activeCity) {
      setStatus("error");
      setErrorMessage("Please select a city.");
      return;
    }

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
      const formId = "4b316979-6a89-44cf-a14a-a260c172ebd9";
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
              name: "explore_other_cities",
              value: activeCity,
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

  const handleClose = () => {
    setStatus("idle");
    setErrorMessage("");
    setEmail("");
    setSelectedCityValue("");
    onClose();
  };

  // Dynamically set modal width based on whether the cards grid or the email form is shown
  const modalMaxWidth = !activeCity && status !== "success" ? "850px" : "600px";

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: modalMaxWidth, transition: "max-width 0.3s ease" }}>
        <button className="modal-close-btn" onClick={handleClose} aria-label="Close modal">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {status !== "success" ? (
          <>
            {/* Back Button (only show if we came from general Cities modal and a city was clicked) */}
            {!city && selectedCityValue && (
              <button
                onClick={() => setSelectedCityValue("")}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.9rem",
                  marginBottom: "20px",
                  fontWeight: 600,
                  transition: "color 0.2s ease"
                }}
                className="back-btn"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 8H1M1 8L7 2M1 8L7 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back to cities
              </button>
            )}

            {activeCity ? (
              // Specific City Email Subscription Form
              <>
                <h2 className="modal-title" style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", lineHeight: "1.2", marginBottom: "32px", padding: "0 10px" }}>
                  Be the first to know about Hospitality Social Media Summit in {activeCity}
                </h2>

                <form onSubmit={handleSubmit} className="subscribe-form-container" style={{ maxWidth: "100%", padding: "6px 6px 6px 24px" }}>
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
                    required
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
                        </svg>
                      </>
                    ) : (
                      <>
                        Get notified
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 8H15M15 8L9 2M15 8L9 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </>
                    )}
                  </button>
                </form>

                {status === "error" && (
                  <div className="error-msg" style={{ paddingLeft: "24px", marginTop: "12px" }}>
                    {errorMessage}
                  </div>
                )}
              </>
            ) : (
              // No Specific City Selected: Render the Grid of Cities Cards
              <>
                <h2 className="modal-title" style={{ fontSize: "clamp(2rem, 5vw, 2.8rem)", fontStyle: "italic", marginBottom: "12px" }}>
                  Explore other cities
                </h2>
                <p className="modal-subtitle" style={{ maxWidth: "550px", margin: "0 auto 36px auto" }}>
                  Agendas vary by market and local partners. Pick your city to see dates, venue, speakers and tickets.
                </p>
                
                <div className="cities-grid" style={{ marginTop: "24px", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))" }}>
                  {["Barcelona", "Paris", "Dubai", "New York"].map((cityName) => (
                    <div
                      key={cityName}
                      className="city-card"
                      onClick={() => {
                        setSelectedCityValue(cityName);
                        if (status === "error") setStatus("idle");
                      }}
                      style={{ padding: "32px 16px", gap: "16px" }}
                    >
                      <h3 className="city-name" style={{ fontSize: "1.6rem" }}>{cityName}</h3>
                      <button className="city-btn" style={{ padding: "8px 18px", fontSize: "0.85rem" }}>
                        Get notified
                        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 8H15M15 8L9 2M15 8L9 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
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
            <h2 className="success-title">You're on the list!</h2>
            <p className="success-message" style={{ marginBottom: "28px" }}>
              Thank you! We will notify you as soon as details and agendas for the {activeCity} summit are available.
            </p>
            <button
              onClick={handleClose}
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
