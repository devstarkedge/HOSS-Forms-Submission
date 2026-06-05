# HOSS Form Page (Hospitality Social Media Summit)

This is a premium Next.js-based subscription landing page designed for the **Hospitality Social Media Summit**. It features a modern, responsive design and a custom-styled email subscription form integrated directly with your HubSpot portal.

---

## 🚀 Getting Started

To run this application locally, follow these steps:

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the page.

### 3. Production Build
To build the application for production deployment:
```bash
npm run build
```

---

## 🎨 Design & Style Guide

* **Styling**: Built entirely using **Vanilla CSS** (`src/app/globals.css`) for high performance and full design control.
* **Typography**: Uses Google Fonts `Playfair Display` for elegant serif headings and `Outfit` for clean sans-serif body text.
* **Theme Colors**:
  * Off-white background: `#edf1e9`
  * Dark forest text color: `#0c2417`
  * Vibrant lime green accent color: `#c3f639`

---

## 📊 HubSpot Integration

This project integrates three custom-styled forms directly with the official **HubSpot Forms Submission API (v3)**:

1. **Newsletter Subscription Form**
   * **Form ID**: `5fa365ba-30ce-4798-a519-499a85469fe9`
   * **Location**: Homepage Footer (`src/app/page.tsx`)

2. **Sponsorship Deck Request Modal**
   * **Form ID**: `455dfa10-033e-4f85-8367-c870fc8566fc`
   * **Location**: Popover Modal (`src/components/SponsorshipModal.tsx`)

3. **Become a Sponsor Request Modal**
   * **Form ID**: `cf5d5022-c920-4b2e-9c0e-07d974823ae8`
   * **Location**: Popover Modal (`src/components/BecomeSponsorModal.tsx`)

### General HubSpot Configuration:
* **Portal ID**: `148257610`
* **Region**: `eu1` (European data residency endpoint)

For details on the payload formats, cookie tracking implementation (`hubspotutk`), and code structure, please read the dedicated documentation:
👉 **[HubSpot Integration Guide](./HUBSPOT_INTEGRATION_GUIDE.md)**
