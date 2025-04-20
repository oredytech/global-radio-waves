
export const setupAudioEventListeners = (
  audio: HTMLAudioElement,
  onPlaying: () => void,
  onPause: () => void,
  onError: () => void,
  onWaiting: () => void
) => {
  audio.addEventListener("playing", onPlaying);
  audio.addEventListener("pause", onPause);
  audio.addEventListener("error", onError);
  audio.addEventListener("waiting", onWaiting);

  return () => {
    audio.removeEventListener("playing", onPlaying);
    audio.removeEventListener("pause", onPause);
    audio.removeEventListener("error", onError);
    audio.removeEventListener("waiting", onWaiting);
  };
};
