# OptiImage Frontend

A clean, responsive frontend interface for the [OptiImage Server](https://optiimage-server-ev2l.onrender.com) — an image compression and optimization API. Upload images, configure compression settings, and download optimized files as a ZIP archive.

## 🌟 Live Demo

**Production URL**: [Deployed on Vercel]

**Backend API**: https://optiimage-server-ev2l.onrender.com

## ✨ Features

- **Drag & Drop Upload** — Drop images directly or click to browse
- **Multi-format Support** — Upload JPEG, PNG, WebP, and HEIC images
- **Format Conversion** — Convert images between JPEG, PNG, and WebP (HEIC auto-converts to JPEG)
- **Quality Control** — Adjustable compression quality (1–100%)
- **Resize** — Optional width-based resizing while maintaining aspect ratio
- **Target File Size** — Set a desired file size and let the server's binary search algorithm get close to it
- **Batch Processing** — Upload and process up to 10 images at once
- **Image Preview** — Click on thumbnails to view images full-screen
- **Progress Tracking** — Real-time simulated progress feed during compression
- **Responsive Design** — Works seamlessly on mobile, tablet, and desktop

## 🛠️ Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 3.4
- **Image Processing**: Sharp (via backend API)
- **Deployment**: Vercel

## 🎨 Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| 🔵 Opti Blue | `#005FEF` | Primary brand color, buttons, links |
| ⚫ Charcoal | `#1F1F1F` | Headings, primary text |
| ⚪ White | `#FFFFFF` | Backgrounds, contrast |
| 🔹 Light Blue | `#EAF2FF` | Subtle backgrounds, cards, highlights |
| 🌑 Dark Blue | `#0047B8` | Hover states, darker accents |

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/optiimage-frontend.git
   cd optiimage-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🔌 API Configuration

The frontend connects to the OptiImage backend API. Configuration is in `src/config/api.js`:

```javascript
// Production URL (hosted on Render)
const API_BASE_URL = 'https://optiimage-server-ev2l.onrender.com';

// Local development URL — uncomment when testing against local server
// const API_BASE_URL = 'http://localhost:3000';
```

To test against a local backend, comment out the production URL and uncomment the localhost line.

## 📁 Project Structure

```
optiimage-frontend/
├── public/
│   └── images/
│       ├── optiimage-logo.png    # Logo
│       └── favicon.png           # Favicon
├── src/
│   ├── components/
│   │   ├── Header.jsx            # Sticky header with logo
│   │   ├── Footer.jsx            # Footer with credits
│   │   ├── UploadZone.jsx        # Drag & drop upload + file previews
│   │   ├── OptionsPanel.jsx      # Quality, format, and advanced options
│   │   ├── ProgressTracker.jsx   # Simulated progress feed during compression
│   │   ├── ResultSection.jsx     # Results card with download button
│   │   └── ImagePreview.jsx      # Full-screen image lightbox
│   ├── config/
│   │   └── api.js                # API URL configuration
│   ├── App.jsx                   # Main app with state management
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Tailwind imports + base styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 📡 API Endpoint

The frontend communicates with a single endpoint:

### `POST /api/images/compress`

**Request**: `multipart/form-data`
- `images` — Up to 10 files (JPG, PNG, WebP, HEIC), max 10MB each
- `quality` — (optional) 1–100, default 70
- `format` — (optional) `jpeg`, `png`, or `webp` — defaults to original format
- `width` — (optional) target width in pixels
- `targetSize` — (optional) target file size in KB

**Response**: ZIP file download containing all compressed images

## 🌐 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Vercel auto-detects Vite — no build configuration needed
4. Click **Deploy**

### Environment

No environment variables are required. The API URL is hardcoded in `src/config/api.js`. If you need to change it, update that file before deploying.

## 🔒 Limitations

- Max 10 images per upload
- Max 10MB per image
- Supported input formats: JPEG, PNG, WebP, HEIC
- Output formats: JPEG, PNG, WebP
- HEIC files are auto-converted to the selected output format (cannot output HEIC)

## 📄 License

ISC License

## 👨‍💻 Author

Built as a frontend interface for the OptiImage compression API.

## 🤝 Related

- [OptiImage Server](https://github.com/MyBaida/optiimage-server) — The backend API that powers this frontend

---

**Happy Compressing! 🖼️✨**
