import React from 'react'
import './SongBox.css';

export default function SongBox(props) {
  return (
    <div className='SongBox'>
    <div className="img_play">
        <img src={props.s_img} alt="" />
        <i class="bi playListPlay bi-play-fill"  onClick={props.onClick}></i>
    </div>
    <h5>
        {props.s_name}
        <div className="subtitel">{props.a_name}</div>
    </h5>
    </div>
  )
}
