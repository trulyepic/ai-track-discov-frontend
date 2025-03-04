import { useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import "./App.css";
import MusicDiscovery from "./components/MusicDiscovery";

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <HelmetProvider>
      <Helmet>
        <title>Track Discov </title>
        <meta
          name="description"
          content="Discover new music with AI-powered recommendations based on your favorite tracks, genres, and moods."
        />
        <meta property="og:title" content="Track Discov - AI Music Discovery" />
        <meta
          property="og:description"
          content="Get AI-powered music recommendations instantly. Enter your favorite songs or genres and explore new tracks!"
        />
        <meta property="og:image" content="%PUBLIC_URL%/preview-image.jpg" />
        <meta property="og:url" content="https://www.trackdiscov.com/" />
        <link rel="canonical" href="https://www.trackdiscov.com/" />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#141922] text-gray-900 dark:text-[#E2E8F0] p-6">
        <div className="w-full max-w-3xl p-6 bg-white dark:bg-[#242c3a] rounded-lg shadow-lg border-2 border-gray-300 dark:border-[#4C51BF]">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-extrabold text-center mb-6  text-gray-900 dark:text-[#4C51BF]">
              🎵 Track Discov
            </h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-md transition duration-300 
              bg-gray-200 text-gray-800 hover:bg-gray-300
              dark:bg-[#4C51BF] dark:text-white dark:hover:bg-[#3C40A0]"
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>
          <MusicDiscovery />

          <footer
            className="text-center py-4 mt-10 rounded-lg shadow-md border-t border-gray-300 dark:border-[#4C51BF] 
          bg-gray-100 text-gray-800 dark:bg-[#2D3748] dark:text-[#A3BFFA]"
          >
            <p>
              Powered by{" "}
              <span className="font-bold text-[#4C51BF] dark:text-[#c0c3f3]">
                OpenAI
              </span>{" "}
              &{" "}
              <span className="font-bold text-[#4C51BF] dark:text-[#c0c3f3]">
                Last.fm
              </span>
            </p>
          </footer>
        </div>
      </div>
    </HelmetProvider>
  );
}

export default App;
