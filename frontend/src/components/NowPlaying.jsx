import React, { useState } from 'react';
import './NowPlaying.css';

function NowPlaying({ 
  song, 
  close, 
  isPlaying, 
  currentTime, 
  duration, 
  repeatOne,
  setRepeatOne,
  handlePlayPause, 
  handleNext, 
  handlePrev, 
  handleSeek,
  deleteSong,
  removeFromPlaylist,
  addToPlaylist
}) {

  const [showMenu, setShowMenu] = useState(false);

  const userName = String(localStorage.getItem("userName"));

  // Seconds ko MM:SS format me convert karne ke liye helper function
  const formatTime = (time) => {
    if (isNaN(time) || time === null) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Song download karne ka core logic ka handler
  const handleDownload = () => {
    if (!song || !song.audio) {
      alert("Suno bhai, is gaane ki audio file available nahi hai.");
      return;
    }
    const link = document.createElement('a');
    link.href = song?.audio;
    link.download = `${song.englishName || 'audio' || song.title}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="nowPlaying-container">
      
      {/* Top Navigation Bar */}
      <div className="top-bar">
        <button className="icon-btn" onClick={close}>
          <i className="bi bi-chevron-left"></i>
        </button>
        <h4 className="top-title">{song.englishName || "Now Playing"}</h4>

        <div className="actionMenu">
          <button
            className="icon-btn"
            onClick={() => setShowMenu(!showMenu)}
          >
            <i className="bi bi-three-dots-vertical"></i>
          </button>

          {showMenu && (
            <div className="dropdownMenu">

              {/* Delete */}
              {song.source === "db" &&
                song.uploadBy === userName(
                  <button
                    className="deleteBtn"
                    onClick={() => {
                      deleteSong(song.id);
                      setShowMenu(false);
                    }}
                  >
                    <i className="bi bi-trash"></i>
                    Delete
                  </button>
                )}

              {/* Add To Playlist */}
              {localStorage.getItem("token") &&
                !song.inPlaylist && (
                  <button
                    className="playlistBtn"
                    onClick={() => {
                      addToPlaylist(song.id);
                      setShowMenu(false);
                    }}
                  >
                    <i className="bi bi-plus-circle"></i>
                    Add To Playlist
                  </button>
                )}

              {/* Remove From Playlist */}
              {localStorage.getItem("token") &&
                song.inPlaylist && (
                  <button
                    className="playlistBtn"
                    onClick={() => {
                      removeFromPlaylist(song.id);
                      setShowMenu(false);
                    }}
                  >
                    <i className="bi bi-dash-circle"></i>
                    Remove From Playlist
                  </button>
                )}

            </div>
          )}
        </div>
      </div> 

      {/* Album Cover Art */}
      <div className="cover-wrapper">
        <img
          src={song.img || "https://via.placeholder.com/300"}
          alt="Album Cover"
          className="cover-image"
        />
      </div>

      {/* Song Information */}
      <div className="song-info-section">
        <div className="text-info">
          
          {/* Marquee for Names */}
          <div className="marquee-container">
            <h1 className="marquee-text">
              {song.englishName} {song.hindiName ? `• ${song.hindiName}` : ''} {song.urduName ? `• ${song.urduName}` : ''}
            </h1>
          </div>
          
          {/* Artist & Album in one line */}
          <div className="artist-album-row">
            <span className="artist-name">{song.artist || "Unknown Artist"}</span>
            <span className="dot-separator">•</span>
            <span className="album-name">{song.album || "Unknown Album"}</span>
          </div>
          
          {/* Uploaded By */}
          <div className="uploaded-by-row">
            Uploaded by: <span className="uploader-name">{song.uploadBy || "Mixora"}</span>
          </div>
          
        </div>
        
        {/* Like Button */}
        <button className="like-btn">
          <i className="bi bi-heart"></i>
        </button>
      </div>

      {/* Progress Bar Section */}
      <div className="progress-section">
        <input 
          type="range" 
          className="progress-bar" 
          min="0" 
          max={duration || 0} 
          value={currentTime} 
          onChange={handleSeek}
        />
        <div className="time-row">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Playback Controls (Ab Sab functional hain) */}
      <div className="controls-section">
        {/* Shuffle ki jagah functional Repeat button */}
        <button className="icon-btn" onClick={() => setRepeatOne(!repeatOne)}>
          <i className={repeatOne ? "bi bi-repeat-1 text-primary" : "bi bi-repeat"}></i>
        </button>
        
        <button className="icon-btn" onClick={handlePrev}><i className="bi bi-skip-backward-fill"></i></button>
        
        <button className="play-pause-btn" onClick={handlePlayPause}>
          <i className={isPlaying ? "bi bi-pause-fill" : "bi bi-play-fill"}></i>
        </button>
        
        <button className="icon-btn" onClick={handleNext}><i className="bi bi-skip-forward-fill"></i></button>
        
        {/* Functional Download Button */}
        <button className="icon-btn" onClick={handleDownload}><i className="bi bi-download"></i></button>
      </div>

    </div>
  );
}

export default NowPlaying;