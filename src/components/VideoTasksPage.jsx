import React, { useEffect, useRef, useState } from "react";

// Example task; you can expand with more videos as needed.
const VIDEO_TASKS = [
  {
    id: "yt1",
    title: "Aira Quick Demo",
    ytId: "dQw4w9WgXcQ", // Replace with your video ID
    minWatch: 4, // seconds needed to earn
    reward: 20,
  },
];

function loadYouTubeAPI(callback) {
  if (window.YT && window.YT.Player) {
    callback();
    return;
  }
  const script = document.createElement("script");
  script.src = "https://www.youtube.com/iframe_api";
  window.onYouTubeIframeAPIReady = callback;
  document.body.appendChild(script);
}

export default function VideoTasksPage() {
  const [watched, setWatched] = useState({});
  const [completed, setCompleted] = useState({});
  const [playerReady, setPlayerReady] = useState(false);
  const players = useRef({});
  const timers = useRef({});

  useEffect(() => {
    loadYouTubeAPI(() => setPlayerReady(true));
    return () => {
      // Cleanup timers and YT players
      Object.values(timers.current).forEach(t => clearInterval(t));
      Object.values(players.current).forEach(p => p?.destroy && p.destroy());
    };
  }, []);

  // Initialize YT Players
  useEffect(() => {
    if (!playerReady) return;
    VIDEO_TASKS.forEach(task => {
      if (players.current[task.id]) return; // already initialized
      players.current[task.id] = new window.YT.Player(`ytplayer-${task.id}`, {
        videoId: task.ytId,
        events: {
          onStateChange: e => handleStateChange(e, task),
        },
        playerVars: {
          controls: 1,
          modestbranding: 1,
          rel: 0,
          disablekb: 1,
        },
      });
    });
    // eslint-disable-next-line
  }, [playerReady]);

  function handleStateChange(event, task) {
    const ytState = event.data;
    if (ytState === window.YT.PlayerState.PLAYING) {
      // Start counting watched seconds, but only if not completed
      if (!completed[task.id]) {
        if (timers.current[task.id]) clearInterval(timers.current[task.id]);
        timers.current[task.id] = setInterval(() => {
          const player = players.current[task.id];
          if (player && player.getCurrentTime) {
            // Only count time if video is actually playing, and can't skip ahead
            setWatched(prev => {
              const prevTime = prev[task.id] || 0;
              // Only count if progress is forward and not over minWatch
              let currTime = Math.floor(player.getCurrentTime());
              if (currTime > prevTime && currTime <= task.minWatch) {
                // If user skips ahead, do not count (only allow +1 per second)
                return { ...prev, [task.id]: currTime };
              }
              return prev;
            });
          }
        }, 1000);
      }
    } else {
      // Pause or ended
      clearInterval(timers.current[task.id]);
      timers.current[task.id] = null;
      // If video ended, credit if not already done
      if (
        ytState === window.YT.PlayerState.ENDED &&
        !completed[task.id] &&
        (watched[task.id] || 0) >= task.minWatch
      ) {
        creditReward(task.id);
      }
    }
  }

  // Reward function (auto-credit on completion)
  function creditReward(id) {
    setCompleted(prev => ({ ...prev, [id]: true }));
    // TODO: call backend to log/credit reward!
  }

  // When user reaches minWatch, credit automatically
  useEffect(() => {
    VIDEO_TASKS.forEach(task => {
      if (
        !completed[task.id] &&
        (watched[task.id] || 0) >= task.minWatch
      ) {
        creditReward(task.id);
      }
    });
    // eslint-disable-next-line
  }, [watched]);

  return (
    <div className="min-h-screen flex flex-col items-center py-6" style={{ background: "#e3efff" }}>
      <div className="w-full max-w-xs">
        <h2 className="text-xl font-bold text-center mb-4" style={{ color: "#2196f3" }}>
          Watch Videos & Earn
        </h2>
        {VIDEO_TASKS.map(task => (
          <div key={task.id} className="neu-card mb-6">
            <div className="font-semibold mb-2" style={{ color: "#4f8cff" }}>
              {task.title}
            </div>
            <div className="mb-2">
              <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: 12 }}>
                <div
                  id={`ytplayer-${task.id}`}
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", borderRadius: 12, background: "#b2c7e6" }}
                />
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-2">
              Watch at least <b>{task.minWatch}s</b> to earn <span className="text-blue-700 font-bold">KES {task.reward}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-600 text-xs">Watched: {watched[task.id] || 0}s</span>
              {completed[task.id] && <span className="text-green-600 text-xs font-bold">✓ Reward Credited!</span>}
            </div>
            <button
              className="neu-btn w-full"
              disabled
              style={{
                opacity: completed[task.id] ? 1 : 0.5,
                background: completed[task.id]
                  ? "linear-gradient(90deg,#43e97b,#38f9d7)"
                  : undefined,
              }}
            >
              {completed[task.id] ? "Reward Credited" : `Watch to Earn`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}