# HubSpot Form Integration Guide (Next.js)

This documentation explains how the custom forms on the HOSS Next.js website submit visitor data directly to your HubSpot portal using the official **HubSpot Forms Submission API (v3)**.

---

## 1. Integration Strategy

Instead of using the standard HubSpot script-embedded `<iframe>` form (which overrides branding and limits UI customizations), we utilize the **HubSpot V3 Submissions API**. This allows us to:
* Keep a premium, custom-styled frontend (pill shape inputs, slide-in modal overlays, inline floating border transitions, custom buttons).
* Submit data directly into HubSpot contacts.
* Capture marketing tracking cookies (`hubspotutk`) and page metrics to link form submissions to existing contact records.

---

## 2. Configuration Settings

These are the credentials and region configurations currently configured for your HOSS forms:

### Portal Details
* **Portal ID**: `148257610` (Unique identifier for your HubSpot account)
* **Region**: `eu1` (European data center residency identifier)

### Integrated Forms

| Form Name | Form ID | Target Fields | File Location |
| :--- | :--- | :--- | :--- |
| **Newsletter Subscription** | `5fa365ba-30ce-4798-a519-499a85469fe9` | `email` | `src/app/page.tsx` |
| **Sponsorship Deck Request** | `455dfa10-033e-4f85-8367-c870fc8566fc` | `email`, `company`, `firstname` | `src/components/SponsorshipModal.tsx` |
| **Become a Sponsor** | `cf5d5022-c920-4b2e-9c0e-07d974823ae8` | `firstname`, `email`, `company`, `message` | `src/components/BecomeSponsorModal.tsx` |
| **Contact Form** | `1369024b-f128-4722-b54a-c388fecb2b8c` | `firstname`, `lastname`, `email`, `company`, `im_getting_in_touch_about`, `message` | `src/components/ContactModal.tsx` |
| **Cities Notification** | `4b316979-6a89-44cf-a14a-a260c172ebd9` | `email`, `explore_other_cities` | `src/components/CityNotificationModal.tsx` |

### API Endpoint URLs
Due to European data privacy residency regulations (`eu1` region), submissions must be routed to the EU1 API domain:

* **Newsletter Subscription Endpoint**:
  ```http
  POST https://api-eu1.hsforms.com/submissions/v3/integration/submit/148257610/5fa365ba-30ce-4798-a519-499a85469fe9
  ```
* **Sponsorship Deck Request Endpoint**:
  ```http
  POST https://api-eu1.hsforms.com/submissions/v3/integration/submit/148257610/455dfa10-033e-4f85-8367-c870fc8566fc
  ```
* **Become a Sponsor Endpoint**:
  ```http
  POST https://api-eu1.hsforms.com/submissions/v3/integration/submit/148257610/cf5d5022-c920-4b2e-9c0e-07d974823ae8
  ```
* **Contact Form Endpoint**:
  ```http
  POST https://api-eu1.hsforms.com/submissions/v3/integration/submit/148257610/1369024b-f128-4722-b54a-c388fecb2b8c
  ```
* **Cities Notification Endpoint**:
  ```http
  POST https://api-eu1.hsforms.com/submissions/v3/integration/submit/148257610/4b316979-6a89-44cf-a14a-a260c172ebd9
  ```

---

## 3. Request Payload Formats

To link submissions to existing contacts and capture pages viewed by visitors, the API expects a JSON POST body with a `context` object containing the visitor's tracking cookie (`hubspotutk`).

### 3.1 Newsletter Subscription Payload
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

### 3.2 Sponsorship Deck Request Payload
```json
{
  "fields": [
    {
      "objectTypeId": "0-1",
      "name": "email",
      "value": "sponsor@example.com"
    },
    {
      "objectTypeId": "0-1",
      "name": "company",
      "value": "Example Corp"
    },
    {
      "objectTypeId": "0-1",
      "name": "firstname",
      "value": "John"
    },
    {
      "objectTypeId": "0-1",
      "name": "lastname",
      "value": "Doe"
    }
  ],
  "context": {
    "pageUri": "https://yoursite.com/",
    "pageName": "HOSS Summit | Stay Up-to-Date",
    "hutk": "xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  }
}
```

### 3.3 Become a Sponsor Payload
```json
{
  "fields": [
    {
      "objectTypeId": "0-1",
      "name": "firstname",
      "value": "John"
    },
    {
      "objectTypeId": "0-1",
      "name": "lastname",
      "value": "Doe"
    },
    {
      "objectTypeId": "0-1",
      "name": "email",
      "value": "sponsor@example.com"
    },
    {
      "objectTypeId": "0-1",
      "name": "company",
      "value": "Example Corp"
    },
    {
      "objectTypeId": "0-1",
      "name": "message",
      "value": "I would like to sponsor the hospitality social media summit."
    }
  ],
  "context": {
    "pageUri": "https://yoursite.com/become-a-sponsor",
    "pageName": "Become a Sponsor | HOSS Summit",
    "hutk": "xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  }
}

### 3.4 Contact Form Payload
```json
{
  "fields": [
    {
      "objectTypeId": "0-1",
      "name": "firstname",
      "value": "John"
    },
    {
      "objectTypeId": "0-1",
      "name": "lastname",
      "value": "Doe"
    },
    {
      "objectTypeId": "0-1",
      "name": "email",
      "value": "john@example.com"
    },
    {
      "objectTypeId": "0-1",
      "name": "company",
      "value": "Example Corp"
    },
    {
      "objectTypeId": "0-1",
      "name": "im_getting_in_touch_about",
      "value": "Tickets & group bookings"
    },
    {
      "objectTypeId": "0-1",
      "name": "message",
      "value": "I have a question about the ticketing process."
    }
  ],
  "context": {
    "pageUri": "https://yoursite.com/",
    "pageName": "HOSS Summit | Stay Up-to-Date",
    "hutk": "xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "ipAddress": "192.168.1.1"
  }
}
```
### 3.5 Cities Notification Payload
```json
{
  "fields": [
    {
      "objectTypeId": "0-1",
      "name": "email",
      "value": "subscriber@example.com"
    },
    {
      "objectTypeId": "0-1",
      "name": "explore_other_cities",
      "value": "Barcelona"
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
   * `name`: Target contact property (e.g. `email`, `company`, `firstname`, `message`).
   * `value`: The actual string content submitted.
2. **`context`**: Meta-data parameters used for channel/lead source analytics:
   * `pageUri`: Page URL where the form submission happened.
   * `pageName`: Document title of the submission page.
   * `hutk`: The HubSpot User Tracking cookie value (`hubspotutk`), which links page-view history to this contact.

---

## 4. Code Implementation Details

### 4.1 Newsletter Form (page.tsx)
The subscription form submission handler is located inside `src/app/page.tsx`:
```typescript
const handleSubscribe = async (e: React.FormEvent) => {
  e.preventDefault();
  setStatus("loading");
  // ... validation ...
  const portalId = "148257610";
  const formId = "5fa365ba-30ce-4798-a519-499a85469fe9";
  const region = "eu1";
  const endpoint = `https://api-${region}.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;
  
  // get cookie and post payload ...
};
```

### 4.2 Sponsorship Modal Form (SponsorshipModal.tsx)
The sponsorship request modal handler is located inside `src/components/SponsorshipModal.tsx`:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setStatus("loading");
  // ... validation ...
  const portalId = "148257610";
  const formId = "455dfa10-033e-4f85-8367-c870fc8566fc";
  const region = "eu1";
  const endpoint = `https://api-${region}.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;

  // get cookie, split full name into firstname and lastname, and post payload ...
};
```

### 4.3 Become a Sponsor Form (BecomeSponsorModal.tsx)
The become a sponsor form submission handler is located inside `src/components/BecomeSponsorModal.tsx`:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setStatus("loading");
  // ... validation ...
  const portalId = "148257610";
  const formId = "cf5d5022-c920-4b2e-9c0e-07d974823ae8";
  const region = "eu1";
  const endpoint = `https://api-${region}.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;

  // get cookie, split full name into firstname and lastname, and post payload ...
};

### 4.4 Contact Form (ContactModal.tsx)
The contact form submission handler is located inside `src/components/ContactModal.tsx`:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setStatus("loading");
  // ... validation ...
  const portalId = "148257610";
  const formId = "1369024b-f128-4722-b54a-c388fecb2b8c";
  const region = "eu1";
  const endpoint = `https://api-${region}.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;

  // get cookie, split full name into firstname and lastname, and post payload ...
};
```

### 4.5 Cities Notification Form (CityNotificationModal.tsx)
The city notification form submission handler is located inside `src/components/CityNotificationModal.tsx`:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setStatus("loading");
  // ... validation ...
  const portalId = "148257610";
  const formId = "4b316979-6a89-44cf-a14a-a260c172ebd9";
  const region = "eu1";
  const endpoint = `https://api-${region}.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;

  // get cookie, activeCity, and post payload ...
};
```

---

## 5. Summary of Benefits
* **Complete Design Freedom**: The developer maintains full control over CSS variables, form layouts, error messages, and loading transitions.
* **Optimized Performance**: Replaces heavier HubSpot script embeds with standard native AJAX/Fetch requests.
* **Tracking Integrity**: By supplying the `context` object and tracking cookie (`hutk`), HubSpot correctly links form submissions to existing contacts and logs visitor page history.

---

## 6. Standard HubSpot Embed Scripts (For Reference)

If you ever need to reference or use the standard HubSpot-embedded iframe scripts instead of the custom AJAX API implementation, here are the configurations for all four forms:

### 6.1 Newsletter Subscription Form
```html
<script charset="utf-8" type="text/javascript" src="//js-eu1.hsforms.net/forms/embed/v2.js"></script>
<script>
  hbspt.forms.create({
    portalId: "148257610",
    formId: "5fa365ba-30ce-4798-a519-499a85469fe9",
    region: "eu1"
  });
</script>
```

### 6.2 Sponsorship Deck Request Form
```html
<script charset="utf-8" type="text/javascript" src="//js-eu1.hsforms.net/forms/embed/v2.js"></script>
<script>
  hbspt.forms.create({
    portalId: "148257610",
    formId: "455dfa10-033e-4f85-8367-c870fc8566fc",
    region: "eu1"
  });
</script>
```

### 6.3 Become a Sponsor Form
```html
<script charset="utf-8" type="text/javascript" src="//js-eu1.hsforms.net/forms/embed/v2.js"></script>
<script>
  hbspt.forms.create({
    portalId: "148257610",
    formId: "cf5d5022-c920-4b2e-9c0e-07d974823ae8",
    region: "eu1"
  });
</script>

### 6.4 Contact Form
```html
<script charset="utf-8" type="text/javascript" src="//js-eu1.hsforms.net/forms/embed/v2.js"></script>
<script>
  hbspt.forms.create({
    portalId: "148257610",
    formId: "1369024b-f128-4722-b54a-c388fecb2b8c",
    region: "eu1"
  });
</script>
```

### 6.5 Cities Notification Form
```html
<script charset="utf-8" type="text/javascript" src="//js-eu1.hsforms.net/forms/embed/v2.js"></script>
<script>
  hbspt.forms.create({
    portalId: "148257610",
    formId: "4b316979-6a89-44cf-a14a-a260c172ebd9",
    region: "eu1"
  });
</script>
```
```
