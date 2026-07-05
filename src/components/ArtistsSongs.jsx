import React from 'react'
import SongBox from './SongBox'
import './ArtistsSongs.css'

export default function ArtistsSongs(props) {
  return (
    <div className='ArtistsSongs'>
      
      <div
        id="posterImg"
        style={{ "--artist-bg": `url(${props.img})` }}
      >
        <div id="closeBatton" onClick={props.closeAWindow}>x</div>
        <img src={props.img} alt={props.name} />
        <h5 id="name">{props.name}</h5>
      </div>
      <div id="top10" className='songList'>
        <div id="a_headding">
            <h1 className='heading'> Songs
                <div>
                    <i class="bi bi-arrow-left-short" id="pop_song_left1"></i>
                    <i class="bi bi-arrow-right-short" id="pop_song_right1"></i>
                </div>
            </h1>
        </div>
        <div id="btn_c_top10">
          {
            props.songList.map((song_data)=> {
              return (
              <SongBox
                key={song_data.id}
                s_img={song_data.img}
                onClick={() => props.onClick(song_data.id)}
                s_name={song_data.englishName}
                a_name={song_data.artist}
                />
              )
            })
          }
        </div>
        
      </div>
    </div>
  )
}
