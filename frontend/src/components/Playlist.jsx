import React from 'react'
import PSong from './PSong'
import './Playlist.css';

export default function Playlist(props) {
  return (
    <div className='Playlist' id='playList'>
      <header id="playlist_header">
        <h1>Playlist</h1>
        <h4 className="active"><span></span><i class="bi bi-apple-music"></i> Playlist</h4>
        <h4><span></span><i class="bi bi-apple-music"></i> Last Listening</h4>
        <h4><span></span><i class="bi bi-apple-music"></i> Recommended</h4>
      </header>
      <div id="ply_song_c">
        {
          props.pSongs?.map((song, i)=>(
            <PSong
              song ={song}
              onClick={(id) => props.onClick(id)}
              Sno={String(i + 1).padStart(2, '0')}
            />
          ))
        }
      </div>
    </div>
  )
}
