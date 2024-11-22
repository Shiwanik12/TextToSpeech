// /src/components/SpeechSynthesisComponent.js
import React, { useState, useEffect } from "react";
import "../styles/SpeechSynthesisComponent.css"; // Corrected import path

const SpeechSynthesisComponent = () => {
  const [voices, setVoices] = useState([]);
  const [speech, setSpeech] = useState(new SpeechSynthesisUtterance());
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);

  // Load voices when available
  useEffect(() => {
    const updateVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      setSpeech((prevSpeech) => {
        prevSpeech.voice = availableVoices[0];
        return prevSpeech;
      });
    };

    updateVoices(); // Call once to populate voices
    window.speechSynthesis.onvoiceschanged = updateVoices; // Update when voices change

    return () => {
      window.speechSynthesis.onvoiceschanged = null; // Clean up on component unmount
    };
  }, []);

  // Handle voice selection change
  const handleVoiceChange = (event) => {
    const voiceIndex = event.target.value;
    setSelectedVoiceIndex(voiceIndex);
    setSpeech((prevSpeech) => {
      prevSpeech.voice = voices[voiceIndex];
      return prevSpeech;
    });
  };

  // Handle speak button click
  const handleSpeak = () => {
    const text = document.querySelector("textarea").value;
    setSpeech((prevSpeech) => {
      prevSpeech.text = text;
      return prevSpeech;
    });

    window.speechSynthesis.speak(speech);
    setIsSpeaking(true);
    setIsPaused(false);
  };

  // Handle pause button click
  const handlePause = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  // Handle resume button click
  const handleResume = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  // Reset buttons when speech ends
  const handleSpeechEnd = () => {
    setIsSpeaking(false);
    setIsPaused(false);
  };

  useEffect(() => {
    speech.onend = handleSpeechEnd;
  }, [speech]);

  return (
    <div className="hero">
      <h1>
        Text To Speech <span>Converter</span>
      </h1>

      <textarea placeholder="Write here....." className="text-area"></textarea>

      <div className="controls">
        <select
          value={selectedVoiceIndex}
          onChange={handleVoiceChange}
          className="voice-select"
        >
          {voices.map((voice, index) => (
            <option key={index} value={index}>
              {voice.name}
            </option>
          ))}
        </select>
      </div>
      <div className="buttons">
        <button
          onClick={handleSpeak}
          disabled={isSpeaking}
          className="control-button"
        >
          Speak
        </button>
        <button
          onClick={handlePause}
          disabled={!isSpeaking || isPaused}
          className="control-button"
        >
          Pause
        </button>
        <button
          onClick={handleResume}
          disabled={!isSpeaking || !isPaused}
          className="control-button"
        >
          Resume
        </button>
      </div>
    </div>
  );
};

export default SpeechSynthesisComponent;
