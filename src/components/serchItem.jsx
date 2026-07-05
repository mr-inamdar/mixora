import React from 'react';
import './serchItem.css';

export default function SearchItem(props) {
  return (
    <div
      className="searchItem"
      onClick={props.onClick}
    >
      <img
        src={props.img}
        alt={props.name}
      />

      <div className="searchInfo">
        <h4>{props.name}</h4>
        <p>{props.artist}</p>
      </div>
    </div>
  );
}