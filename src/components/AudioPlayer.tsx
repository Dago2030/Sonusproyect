// version 0.4 estilo gameboy y centrado
import React, { useRef, useState, useEffect } from "react";
import "./AudioPlayer.css";

const AudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);

  const getAudio = () => audioRef.current;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setAudioURL(url);
    setProgress(0);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    const audio = getAudio();
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    const audio = getAudio();
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = getAudio();
    if (!audio) return;

    const value = Number(e.target.value);
    setVolume(value);
    audio.volume = value;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = getAudio();
    if (!audio) return;

    const value = Number(e.target.value);
    audio.currentTime = (value / 100) * audio.duration;
    setProgress(value);
  };

  useEffect(() => {
    const audio = getAudio();
    if (!audio) return;

    const updateProgress = () => {
      if (!audio.duration) return;
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioURL]);

  return (
    <div className="audio-player-container">
      <div className="audio-player">
        <h2>GB Audio Player</h2>

        <input type="file" accept="audio/*" onChange={handleFileChange} />

        {audioURL && (
          <>
            <audio ref={audioRef} src={audioURL} />

            <div>
              <button onClick={togglePlay}>
                {isPlaying ? "PAUSE" : "PLAY"}
              </button>
              <button onClick={handleStop}>STOP</button>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleProgressChange}
            />

            <div>
              <label>VOLUME</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AudioPlayer;
