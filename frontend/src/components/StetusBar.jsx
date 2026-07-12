import React from 'react';
import './StetusBar.css';

export default function StetusBar(props) {
  const {
    song,
    isPlaying,
    currentTime,
    duration,
    volume,
    repeatOne,
    setRepeatOne,
    handlePlayPause,
    handleNext,
    handlePrev,
    handleSeek,
    handleVolumeChange,
    openSongPage
  } = props;

  useEffect(() => {
    if (!('mediaSession' in navigator) || !song) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.englishName || '',
      artist: song.artist || '',
      album: song.album ||'Mixora',
      artwork: [
        {
          src: song.img,
          sizes: '512x512',
          type: 'image/jpeg',
        },
      ],
    });

    navigator.mediaSession.playbackState = isPlaying
      ? 'playing'
      : 'paused';

    navigator.mediaSession.setActionHandler('play', handlePlayPause);
    navigator.mediaSession.setActionHandler('pause', handlePlayPause);
    navigator.mediaSession.setActionHandler('nexttrack', handleNext);
    navigator.mediaSession.setActionHandler('previoustrack', handlePrev);
  }, [song, isPlaying]);

  const handle_download = () => {

    if (!song?.audio) return;

    const link =
      document.createElement('a');

    link.href = song.audio;

    link.download =
      `${song.englishName || 'song'}.mp3`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  const format_time = (time) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const progress = duration ? Math.min((currentTime / duration) * 100, 100) : 0;

  return (
    <div id="play_system">
      {/* LEFT SIDE: Song Info & Trigger to Open Full Page */}
      <div id="player_left" onClick={openSongPage} style={{ cursor: 'pointer' }}>
        <img src={song.img} alt="" id="poster_master_play" />
        <div id="song_info">
          <h5 id="title">
            <div className="songMarquee">
              <div className="songMarqueeTrack">
                <span className="eng">{song.englishName}</span> &nbsp; | &nbsp;
                <span className="hin">{song.hindiName}</span> &nbsp; | &nbsp;
                <span className="urd">{song.urduName}</span>
              </div>
            </div>
          </h5>
          <div className="subtitle">{song.artist}</div>
        </div>
      </div>

      {/* CENTER: Controls & Seek Bar */}
      <div id="player_center">
        <div className="icon">
          <i className={`bi ${repeatOne ? 'bi-repeat-1' : 'bi-repeat'}`} onClick={() => setRepeatOne(!repeatOne)}></i>
          <i className="bi bi-skip-start-circle" onClick={handlePrev}></i>
          <i className={`bi ${isPlaying ? 'bi-pause-circle-fill' : 'bi-play-circle-fill'}`} onClick={handlePlayPause}  id='master_play_icon'></i>
          <i className="bi bi-skip-end-circle" onClick={handleNext}></i>
          <i className="bi bi-arrow-down-circle" onClick={handle_download}></i>
        </div>

        <div id="manage_system">
          <span id='current_time'>{format_time(currentTime)}</span>
          <div className="bar">
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              id='seek'
            />
            <div id="bar2" style={{ width: `${progress}%` }}></div>
          </div>
          <span id='current_end'>{format_time(duration)}</span>
        </div>
      </div>

      {/* RIGHT SIDE: Volume */}
      <div className="vol">
        <i className={`bi ${volume === 0 ? 'bi-volume-mute-fill' : volume < 50 ? 'bi-volume-down-fill' : 'bi-volume-up-fill'}`} id="vol_icon"></i>
        <div className="vol_bar_container">
          <input type="range" min="0" max="100" value={volume} id="vol_input" onChange={handleVolumeChange} />
          <div className="vol_bar" style={{ width: `${volume}%` }}></div>
        </div>
      </div>
      <div className="playerClose" onClick={props.closePlayer}>
        <i className="bi bi-x-lg"></i>
      </div>
    </div>
  );
}
