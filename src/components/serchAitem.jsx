import React from 'react';
import './serchItem.css';

export default function ArtistSearchItem(props) {
  return (
    <div
      className="artistSearchItem"
      onClick={props.onClick}
    >
      <img
        src={props.img}
        alt={props.name}
      />

      <div className="artistInfo">
        <h4>{props.name}</h4>
        <p>Artist</p>
      </div>
    </div>
  );
}