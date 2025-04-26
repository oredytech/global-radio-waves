
export const setupAudioEventListeners = (
  audio: HTMLAudioElement,
  onPlaying: () => void,
  onPause: () => void,
  onError: () => void,
  onWaiting: () => void
) => {
  const errorHandler = (e: Event) => {
    console.error("Audio error:", e);
    onError();
  };
  
  audio.addEventListener("playing", onPlaying);
  audio.addEventListener("pause", onPause);
  audio.addEventListener("error", errorHandler);
  audio.addEventListener("waiting", onWaiting);
  
  // Add additional event for stalled playback
  audio.addEventListener("stalled", errorHandler);

  return () => {
    audio.removeEventListener("playing", onPlaying);
    audio.removeEventListener("pause", onPause);
    audio.removeEventListener("error", errorHandler);
    audio.removeEventListener("waiting", onWaiting);
    audio.removeEventListener("stalled", errorHandler);
  };
};
