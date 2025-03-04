export const formatRecommendations = (recommendationText = "") => {
  if (!recommendationText.trim()) return []; // Prevents undefined errors

  console.log("Raw Recommendation Text Before Processing:", recommendationText); // Debugging log

  const lines = recommendationText
    .split("\n")
    .filter((line) => line.trim() !== "");
  const recommendations = [];

  lines.forEach((line) => {
    // ✅ Handle format: "1. 'Song Name' by Artist: Description"
    let match = line.match(/(\d+\.\s)"(.+)" by (.+): (.+)/);
    if (match) {
      recommendations.push({
        song: match[2], // Song title
        artist: match[3], // Artist
        description: match[4], // Description
      });
      return;
    }

    // ✅ Handle format: "1. 'Song Name' by Artist - Description"
    match = line.match(/(\d+\.\s)"(.+)" by (.+) - (.+)/);
    if (match) {
      recommendations.push({
        song: match[2],
        artist: match[3],
        description: match[4],
      });
      return;
    }

    // ✅ Handle format: "1. 'Song Name' - Artist"
    match = line.match(/(\d+\.\s)"(.+)" - (.+)/);
    if (match) {
      recommendations.push({
        song: match[2],
        artist: match[3],
        description: "No description provided.",
      });
      return;
    }

    // ✅ Handle format: "- Description" (Previous song continues)
    match = line.match(/-\s(.+)/);
    if (match && recommendations.length > 0) {
      recommendations[recommendations.length - 1].description = match[1]; // Update last song's description
      return;
    }

    // 🚨 Ignore summary lines that don’t match song patterns
    console.warn("Unmatched Line:", line);
  });

  return recommendations;
};
