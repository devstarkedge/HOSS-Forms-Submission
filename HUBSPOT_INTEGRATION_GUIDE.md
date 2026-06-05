# HubSpot Form Integration Guide (Next.js)

This documentation explains how the custom subscription form on the Next.js website submits subscriber data directly to your HubSpot portal using the official **HubSpot Forms Submission API (v3)**.

---

## 1. Integration Strategy

Instead of using the standard HubSpot script-embedded `<iframe>` form (which overrides branding and limits UI customizations), we utilize the **HubSpot V3 Submissions API**. This allows us to:
* Keep a premium, custom-styled frontend (pill shape inputs, animations, custom buttons).
* Submit data directly into HubSpot contacts.
* Capture marketing tracking cookies (`hubspotutk`) and page metrics to link form submissions to existing contact records.

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

## 3. Request Payload Format

To link submissions to existing contacts and capture pages viewed by visitors, the API expects a JSON POST body with a `context` object containing the visitor's tracking cookie (`hubspotutk`):

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

### Key Parameters:
1. **`fields`**: An array mapping inputs to contact fields in HubSpot.
   * `objectTypeId`: `"0-1"` designates the HubSpot "Contact" schema.
   * `name`: Target contact property (`email`).
   * `value`: The actual string content submitted.
2. **`context`**: Meta-data parameters used for channel/lead source analytics:
   * `pageUri`: Page URL where the form submission happened.
   * `pageName`: Document title of the submission page.
   * `hutk`: The HubSpot User Tracking cookie value (`hubspotutk`), which links page-view history to this contact.

---

## 4. Code Implementation Detail

The form submission handler is implemented inside `src/app/page.tsx` as follows:

```typescript
const handleSubscribe = async (e: React.FormEvent) => {
  e.preventDefault();
  setStatus("loading");

  try {
    const portalId = "148257610";
    const formId = "5fa365ba-30ce-4798-a519-499a85469fe9";
    const region = "eu1";
    const endpoint = `https://api-${region}.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;

    // Helper to retrieve the HubSpot tracking cookie (hubspotutk) from the browser
    const getCookie = (name: string) => {
      if (typeof document === "undefined") return undefined;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
      return undefined;
    };
    
    const hutk = getCookie("hubspotutk");

    // Submit data via POST request
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
        context: {
          pageUri: typeof window !== "undefined" ? window.location.href : "",
          pageName: typeof window !== "undefined" ? document.title : "",
          ...(hutk ? { hutk } : {}), // Sends the tracking cookie context if present
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
* **Tracking Integrity**: By supplying the `context` object and tracking cookie (`hutk`), HubSpot correctly links form submissions to existing contacts and logs visitor page history.
