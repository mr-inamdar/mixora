import React from 'react'
import './PSong.css';

export default function PSong(props) {
  return (
    <div className='PSong'>
        <div id="left_c">
          <span>{props.Sno}</span>
          <img src={props.song.img} alt="" />
        </div>
        <h5>
            <span>{props.song.englishName}</span>
            <div className="subtitel">{props.song.artist}</div>
        </h5>
        <i class="bi playListPlay bi-play-fill" onClick={()=>props.onClick(props.song.id)}></i>
    </div>
  )
}
