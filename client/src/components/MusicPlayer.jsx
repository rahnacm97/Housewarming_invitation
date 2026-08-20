import React, { useEffect, useRef, useState } from 'react';
import { Music, VolumeX } from 'lucide-react';
import { CONFIG } from '../config';

const MusicPlayer = ({ shouldPlay, triggerPlay }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);

  useEffect(() => {
    // Initialize audio object
    audioRef.current = new Audio(CONFIG.musicUrl);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4; // 40% volume for subtle background ambiance

    // Handle ended or error events
    audioRef.current.onerror = () => {
      console.warn("Background music file not found or couldn't be loaded at:", CONFIG.musicUrl);
      setAudioError(true);
    };

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current || audioError) return;

    if (shouldPlay) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.log("Audio playback was blocked or failed:", error);
            setIsPlaying(false);
          });
      }
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [shouldPlay, audioError]);

  const togglePlay = () => {
    if (!audioRef.current || audioError) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      triggerPlay(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          triggerPlay(true);
        })
        .catch(err => console.log(err));
    }
  };

  // If there's an error loading audio, we don't render the control to keep the UI clean
  if (audioError) return null;

  return (
    <button
      className={`floating-music-btn ${isPlaying ? 'music-spinning' : 'music-paused'}`}
      onClick={togglePlay}
      title={isPlaying ? 'Pause Music' : 'Play Music'}
      aria-label="Toggle background music"
    >
      {isPlaying ? <Music size={20} /> : <VolumeX size={20} />}
    </button>
  );
};

export default MusicPlayer;
