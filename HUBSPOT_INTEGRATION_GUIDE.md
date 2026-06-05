# HubSpot Form Integration Guide (Next.js)

This documentation explains how the custom subscription form on the Next.js website submits subscriber data directly to your HubSpot portal using the official **HubSpot Forms Submission API (v3)**.

---

## 1. Integration Strategy

Instead of using the standard HubSpot script-embedded `<iframe>` form (which overrides branding and limits UI customizations), we utilize the **HubSpot V3 Submissions API**. This allows us to:
* Keep a premium, custom-styled frontend (pill shape inputs, animations, custom buttons).
* Submit data directly into HubSpot contacts.
* Avoid heavy external script embeds.

---

## 2. Configuration Settings

These are the credentials and region configurations currently configured for your HOSS form:

| Property | Value | Description |
| :--- | :--- | :--- |
| **Portal ID** | `148257610` | Unique identifier for your HubSpot account. |
| **Form ID** | `5fa365ba-30ce-4798-a519-499a85469fe9` | Target form identifier in your portal. |
| **Region** | `eu1` | European data center residency identifier. |

### API Endpoint URL
Due to European data privacy residency regulations (`eu1` region), submissions must be routed to the EU1 API domain:
```http
POST https://api-eu1.hsforms.com/submissions/v3/integration/submit/148257610/5fa365ba-30ce-4798-a519-499a85469fe9
```

---

## 3. Request Payload Options

The API accepts either a simplified payload (just form fields) or an advanced tracking payload (with cookie tracking and page context). 

### Option A: Simplified Payload (No Cookies / No Page Context)
If you do not want to deal with tracking cookies or page context, you can submit **only** the form fields. This keeps the implementation extremely lightweight, GDPR-friendly, and simple:

```json
{
  "fields": [
    {
      "objectTypeId": "0-1",
      "name": "email",
      "value": "subscriber@example.com"
    }
  ]
}
```

### Option B: Advanced Payload (With Cookies & Page Context)
This structure sends visitor context to HubSpot. It associates page-view history with the contact:

```json
{
  "fields": [
    {
      "objectTypeId": "0-1",
      "name": "email",
      "value": "subscriber@example.com"
    }
  ],
  "context": {
    "pageUri": "https://yoursite.com/",
    "pageName": "HOSS Summit | Stay Up-to-Date",
    "hutk": "xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  }
}
```

---

## 4. Code Implementation Detail

Depending on your preference, you can implement the API fetch request in two ways.

### Method 1: Simplified Implementation (Recommended for simplicity)
This version removes all cookie lookups and context fields, posting only the email parameter:

```typescript
const handleSubscribe = async (e: React.FormEvent) => {
  e.preventDefault();
  setStatus("loading");

  try {
    const portalId = "148257610";
    const formId = "5fa365ba-30ce-4798-a519-499a85469fe9";
    const region = "eu1";
    const endpoint = `https://api-${region}.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;

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
            value: email, // state variable containing user email
          },
        ],
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
  }
};
```

### Method 2: Full Integration (With Cookie Tracking)
Use this version if your client requires active user session tracking or page analytics inside HubSpot:

```typescript
const handleSubscribe = async (e: React.FormEvent) => {
  e.preventDefault();
  setStatus("loading");

  try {
    const portalId = "148257610";
    const formId = "5fa365ba-30ce-4798-a519-499a85469fe9";
    const region = "eu1";
    const endpoint = `https://api-${region}.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;

    // Helper to extract HubSpot tracking cookie
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
  }
};
```

---

## 5. Summary of Benefits
* **Complete Design Freedom**: The developer maintains full control over CSS variables, form layouts, error messages, and loading transitions.
* **Optimized Performance**: Replaces heavier HubSpot script embeds with a single native AJAX/Fetch request.
* **GDPR Compliance Option**: By opting for Method 1, you do not extract or track client cookies, reducing data privacy compliance complexity.
