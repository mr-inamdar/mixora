import React from 'react'
import './Artist.css'

export default function Artist(props) {
  return (
    <div className="artist" onClick={props.onClick}>

        <img src={props.a_img} alt={props.a_img} />

        <div className="artist_info">
            <h2>{props.a_name}</h2>
            <span>Artist</span>
        </div>

    </div>
  )
}
