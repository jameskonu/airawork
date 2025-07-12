import React, { useEffect, useRef, useState } from "react";

/**
 * Props:
 *   videoId: string (YouTube video ID)
 *   minWatch: number (required seconds to earn reward)
 *   reward: number (KES or points)
 *   onReward: function (optional, called when reward is credited)
 *   title: string
 */
export default function YouTubeWatchTask({ videoId, minWatch = 10, reward = 10, onReward, title = "Watch & Earn" }) {
  const [watched, setWatched] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const playerRef = useRef(null);
  const timerRef = useRef(null);

  // Load YouTube API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setPlayerReady(true);
      return;
    }
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    tag.id = "youtube-iframe-api";
    document.body.appendChild(tag);
    window.onYouTubeIframeAPIReady = () => setPlayerReady(true);
    return () => {
      // cleanup
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Initialize player
  useEffect(() => {
    if (!playerReady) return;
    playerRef.current = new window.YT.Player(`ytplayer-${videoId}`, {
      videoId,
      playerVars: {
        controls: 1,
        modestbranding: 1,
        rel: 0,
        disablekb: 1,
      },
      events: {
        onStateChange: onPlayerStateChange,
      }
    });
    // eslint-disable-next-line
  }, [playerReady, videoId]);

  // Player state change handler
  function onPlayerStateChange(event) {
    if (completed) return;
    if (event.data === window.YT.PlayerState.PLAYING) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        const sec = Math.floor(playerRef.current.getCurrentTime());
        setWatched((prev) => {
          // Only count forward and up to minWatch
          if (sec > prev && sec <= minWatch) {
            return sec;
          }
          return prev;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  // Reward logic
  useEffect(() => {
    if (!completed && watched >= minWatch) {
      setCompleted(true);
      if (onReward) onReward(reward);
    }
    // eslint-disable-next-line
  }, [watched, completed, onReward, reward]);

  return (
    <div className="neu-card max-w-xs mx-auto mb-6">
      <div className="font-semibold mb-2" style={{ color: "#4f8cff" }}>
        {title}
      </div>
      <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: 12 }}>
        <div
          id={`ytplayer-${videoId}`}
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", borderRadius: 12, background: "#b2c7e6" }}
        />
      </div>
      <div className="text-xs text-gray-500 mb-2 mt-2">
        Watch at least <b>{minWatch}s</b> to earn <span className="text-blue-700 font-bold">KES {reward}</span>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-blue-600 text-xs">Watched: {watched}s</span>
        {completed && (
          <span className="text-green-600 text-xs font-bold animate-pulse">✓ Reward Credited!</span>
        )}
      </div>
      <button
        className="neu-btn w-full"
        disabled
        style={{
          opacity: completed ? 1 : 0.5,
          background: completed
            ? "linear-gradient(90deg,#43e97b,#38f9d7)"
            : undefined,
        }}
      >
        {completed ? "Reward Credited" : `Watch to Earn`}
      </button>
    </div>
  );
}