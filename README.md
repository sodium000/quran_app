# Quran Web Application 📖

A modern, immersive, and premium Quran reading experience built with Next.js. This application features high-quality audio recitation, dynamic verse highlighting, and a sleek, glassmorphic UI.

![Quran App Preview](https://images.unsplash.com/photo-1584281723351-9d74775d7b6b?auto=format&fit=crop&q=80&w=1200)

## ✨ Features

- **📖 Complete Quran Library**: Browse all 114 Surahs with detailed information.
- **🎧 Seamless Audio Recitation**: Stream verse-by-verse audio from world-renowned reciter Mishary Rashid Alafasy.
- **✨ Active Highlighting**: Currently playing verses are visually highlighted and automatically scrolled into view.
- **🛠️ Personalized Experience**: Adjustable font sizes for both Arabic text and English translations.
- **🔍 Global Search**: Quickly find any Surah or verse.
- **⚡ Performance First**: Built with Next.js and optimized using Turbopack for lightning-fast navigation.
- **🛡️ Audio Proxying**: Custom server-side proxying for audio streams to ensure high reliability across all networks.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Context API
- **Data APIs**: 
  - [Al Quran Cloud API](https://alquran.cloud/api) (Recitation & Metadata)
  - [Fawaz Ahmed Quran API](https://github.com/fawazahmed0/quran-api) (Text & Translations)

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd quran_app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Download Quran Data**:
   The app uses a local JSON file for faster searching. Generate it using the provided utility script:
   ```bash
   node downloadData.js
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open the app**:
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

- `src/app/`: Next.js App Router pages and API routes.
- `src/components/`: Reusable UI components.
- `src/context/`: Context providers for settings and global state.
- `public/data/`: Localized Quran JSON data.
- `downloadData.js`: Utility script to sync data from external APIs.

## 📝 License

This project is open-source and available under the MIT License.

---

*Peace be upon you.* 🌙
