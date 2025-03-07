import React, { useState } from "react";
import { getRecommendations, getRecommendationsByTrack } from "../apis/api";
import { formatRecommendations } from "../utils/formatRecommendations";

const MusicDiscovery = () => {
  const [genre, setGenre] = useState("");
  const [numRecommendations, setNumRecommendations] = useState(3);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tracks, setTracks] = useState([""]);

  // 🔥 Function to process and extract the correct keys dynamically
  //   const processData = (apiData, genre) => {
  //     if (!apiData) return null;

  //     // Find the correct keys dynamically
  //     const topSongsKey = Object.keys(apiData).find((key) =>
  //       key.startsWith("Top 10 Songs Based on")
  //     );

  //     const recommendationsKey = Object.keys(apiData).find((key) =>
  //       key.startsWith("Song Recommendations Based on")
  //     );

  //     return {
  //       topSongs: apiData[topSongsKey] || [],
  //       recommendations: recommendationsKey ? apiData[recommendationsKey] : "",
  //     };
  //   };

  const handleFetch = async () => {
    setError("");
    setData(null);
    setLoading(true);

    let result;
    if (tracks.some((track) => track.trim())) {
      result = await getRecommendationsByTrack(tracks, numRecommendations);
    } else if (genre.trim()) {
      result = await getRecommendations(genre, numRecommendations);
    } else {
      setError("⚠️ Please enter a genre or at least one track.");
      setLoading(false);
      return;
    }

    if (result.error) {
      setError(result.error);
    } else {
      setData({
        topSongs: result.topSongs || [],
        recommendations: result.recommendations || "",
        formattedRecommendations: formatRecommendations(
          result.recommendations || ""
        ),
      });
    }
    setLoading(false);
  };

  const getSpotifyTrackId = async (song, artist) => {
    const query = encodeURIComponent(`${song} ${artist}`);
    const url = `https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer YOUR_SPOTIFY_ACCESS_TOKEN`,
      },
    });

    const data = await response.json();
    if (data.tracks && data.tracks.items.length > 0) {
      return data.tracks.items[0].id; // Returns the track ID
    }

    return null;
  };

  // 🔥 Generate Spotify Search Link
  // const generateSpotifyLink = (song, artist) => {
  //   const query = encodeURIComponent(`${song} ${artist}`);
  //   return `https://open.spotify.com/search/${query}`;
  // };

  const generateSpotifyLink = async (song, artist) => {
    const trackId = await getSpotifyTrackId(song, artist);
    return trackId
      ? `https://open.spotify.com/track/${trackId}`
      : `https://open.spotify.com/search/${encodeURIComponent(
          song + " " + artist
        )}`;
  };

  return (
    <div className="space-y-6 flex flex-col">
      <div className="flex-grow">
        {/* User Inputs */}
        <div className="space-y-4">
          <label className="block text-lg font-semibold text-gray-700 dark:text-[#A3BFFA]">
            Enter up to 10 Tracks/Artist or Mood (Track - Artist or Track or
            Artist or sad mood):
          </label>
          {tracks.map((track, index) => (
            <input
              key={index}
              type="text"
              value={track}
              onChange={(e) => {
                const newTracks = [...tracks];
                newTracks[index] = e.target.value;
                setTracks(newTracks);
                setGenre("");
              }}
              placeholder="e.g, Blinding Lights - The Weeknd or Blinding Lights or The Weeknd"
              disabled={genre.trim().length > 0}
              className={`w-full p-3 rounded-md focus:ring-2 outline-none transition ${
                genre.trim().length > 0
                  ? "bg-gray-400 text-gray-600 dark:bg-gray-600 dark:text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-900 dark:bg-[#4A5568] dark:text-[#E2E8F0] focus:ring-[#4C51BF]"
              }`}
            />
          ))}
          <div className="flex space-x-2">
            {tracks.length < 10 && (
              <button
                onClick={() => setTracks([...tracks, ""])}
                disabled={genre.trim().length > 0}
                className={`px-4 py-2 rounded-md transition ${
                  genre.trim().length > 0
                    ? "bg-gray-400 text-gray-600 dark:bg-gray-600 dark:text-gray-400 cursor-not-allowed"
                    : "bg-gray-800 text-white hover:bg-gray-700 dark:bg-[#4C51BF] dark:hover:bg-[#3C40A0]"
                }`}
              >
                {" "}
                + Add
              </button>
            )}
            {/* Only Show Remove Button if More Than 1 Track */}
            {tracks.length > 1 && (
              <button
                onClick={() => setTracks(tracks.slice(0, -1))}
                className="px-4 py-2 rounded-md transition bg-red-600 text-white hover:bg-red-500"
              >
                - Remove
              </button>
            )}
          </div>
          <label className="block text-lg font-semibold text-gray-700 dark:text-[#A3BFFA]">
            Genre:
          </label>
          <input
            type="text"
            value={genre}
            onChange={(e) => {
              setGenre(e.target.value);
              setTracks([""]); // Reset tracks when a genre is entered
            }}
            placeholder="Enter genre (e.g., rock, pop)"
            disabled={tracks.some((track) => track.trim())}
            className={`w-full p-3 rounded-md focus:ring-2 outline-none transition ${
              tracks.some((track) => track.trim())
                ? "bg-gray-400 text-gray-600 dark:bg-gray-600 dark:text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-900 dark:bg-[#4A5568] dark:text-[#E2E8F0] focus:ring-[#4C51BF]"
            }`}
          />

          <label className="block text-lg font-semibold text-gray-700 dark:text-[#A3BFFA]">
            Number of tracks:
          </label>
          <input
            type="number"
            value={numRecommendations}
            onChange={(e) =>
              setNumRecommendations(
                Math.max(1, Math.min(30, Number(e.target.value)))
              )
            }
            min="1"
            max="30"
            c
            className="w-full p-3 bg-gray-200 text-gray-900 dark:bg-[#4A5568] dark:text-[#E2E8F0] rounded-md focus:ring-2 focus:ring-[#4C51BF] outline-none"
          />

          <p className="text-gray-700 dark:text-[#a3befaa0] text-sm">
            <span className="text-gray-800 dark:text-gray-300">🔹</span>
            Select between <strong>1</strong> and <strong>30</strong> tracks.
          </p>

          {/* ✅ Button with Spinner */}
          <button
            onClick={handleFetch}
            disabled={loading}
            className={`w-full font-semibold py-3 rounded-md transition duration-300 flex justify-center items-center mt-6 ${
              loading
                ? "bg-gray-400 text-gray-600 dark:bg-[#4C51BF] dark:opacity-70 cursor-not-allowed"
                : "bg-gray-800 text-white hover:bg-gray-700 dark:bg-[#4C51BF] dark:hover:bg-[#3C40A0]"
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 0116 0H4z"
                  ></path>
                </svg>
                Finding Tracks...
              </>
            ) : (
              "🎶 Discov It!"
            )}
          </button>

          {error && (
            <p className="text-[#F56565] text-sm font-medium">{error}</p>
          )}
        </div>

        {/* Display Results */}
        {data && (
          <div className="space-y-6 mt-6">
            {/* 🎼 Top 10 Songs */}
            <div className="bg-gray-100 dark:bg-[#2D3748] border-l-8 border-[#A3BFFA] p-4 rounded-md shadow-md">
              <h3 className="text-xl font-bold text-gray-900 dark:text-[#4C51BF]">
                {genre.trim().length > 0
                  ? `Top 10 Tracks for ${genre}`
                  : "Your Track List"}
              </h3>
              <ul className="mt-2 space-y-2">
                {data.topSongs.map((song, index) => (
                  <li key={index} className="text-gray-900 dark:text-[#E2E8F0]">
                    🎵 {song}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-200 dark:bg-[#1E293B] border-l-8 border-[#4C51BF] p-4 rounded-md shadow-md">
              <h3 className="text-xl font-bold text-gray-900 dark:text-[#4C51BF]">
                {genre.trim().length > 0
                  ? "Recommendations Based on Top 10"
                  : "Recommendations Based on Your Tracks/Artists"}
              </h3>
              <div className="mt-4 space-y-4">
                {data.formattedRecommendations.length > 0 ? (
                  data.formattedRecommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="bg-gray-300 dark:bg-[#2D3748] p-4 rounded-md shadow-sm"
                    >
                      {/* Song Title */}
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-[#4C51BF]">
                        {rec.song}
                      </h4>

                      {/* Artist Name & Spotify Button in One Line */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-1">
                        <p className="text-sm text-gray-800 dark:text-[#E2E8F0] flex items-center">
                          🎤 {rec.artist}
                        </p>
                        <a
                          href="#"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={async (e) => {
                            e.preventDefault();
                            const trackUrl = await generateSpotifyLink(
                              rec.song,
                              rec.artist
                            );
                            window.open(trackUrl, "_blank");
                          }}
                          className="px-3 py-1 text-white rounded-md transition 
  bg-gray-800 hover:bg-gray-700 dark:bg-[#4C51BF] dark:hover:bg-[#3C40A0] dark:text-white flex items-center justify-center w-fit"
                        >
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg"
                            alt="Spotify"
                            className="w-4 h-4 mr-2"
                          />
                          Listen
                        </a>
                      </div>
                      {/* Song Description */}
                      <p className="mt-2 text-gray-800 dark:text-[#E2E8F0]">
                        {rec.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-900 dark:text-[#E2E8F0]">
                    No structured recommendations available.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* <footer className="text-center py-4 mt-10 bg-[#2D3748] rounded-lg shadow-md border-t border-[#4C51BF]">
        <p className="text-[#A3BFFA] text-sm font-medium">
          Powered by <span className="text-[#c0c3f3] font-bold">OpenAI</span> &{" "}
          <span className="text-[#c0c3f3] font-bold">Last.fm</span>
        </p>
      </footer> */}
    </div>
  );
};

export default MusicDiscovery;
