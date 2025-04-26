
export const setupAudioEventListeners = (
  audio: HTMLAudioElement,
  onPlaying: () => void,
  onPause: () => void,
  onError: () => void,
  onWaiting: () => void,
  onEnded: () => void
) => {
  const errorHandler = (e: Event) => {
    console.error("Audio error:", e);
    onError();
  };
  
  // Clear any existing event listeners first
  audio.removeEventListener("playing", onPlaying);
  audio.removeEventListener("pause", onPause);
  audio.removeEventListener("error", errorHandler);
  audio.removeEventListener("waiting", onWaiting);
  audio.removeEventListener("ended", onEnded);
  audio.removeEventListener("stalled", errorHandler);
  
  // Add fresh event listeners
  audio.addEventListener("playing", onPlaying);
  audio.addEventListener("pause", onPause);
  audio.addEventListener("error", errorHandler);
  audio.addEventListener("waiting", onWaiting);
  audio.addEventListener("ended", onEnded);
  audio.addEventListener("stalled", errorHandler);

  return () => {
    audio.removeEventListener("playing", onPlaying);
    audio.removeEventListener("pause", onPause);
    audio.removeEventListener("error", errorHandler);
    audio.removeEventListener("waiting", onWaiting);
    audio.removeEventListener("ended", onEnded);
    audio.removeEventListener("stalled", errorHandler);
  };
};

export const resetAudio = (audio: HTMLAudioElement): void => {
  if (!audio) return;
  
  // Stop any current playback
  try {
    audio.pause();
  } catch (e) {
    console.error("Error pausing audio:", e);
  }
  
  // Clear the source
  audio.src = "";
  
  // Reset all properties
  audio.currentTime = 0;
  
  // Force reload
  try {
    audio.load();
  } catch (e) {
    console.error("Error reloading audio:", e);
  }
};
