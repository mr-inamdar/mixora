import React from 'react';
import './SongDetails.css';

export default function SongDetails(props) {
  return (
    <div className="SongDetails">

      <button
        id="sdClose"
        onClick={props.closeWindow}
      >
        <i className="bi bi-x"></i>
      </button>

      <div id="sImgBox">
        <img
          src={props.img}
          alt={props.name}
        />
      </div>

      <div id="detailContainner">

        <h1 id="DName">
          {props.name}
        </h1>

        <h6 id="DArtist">
          {props.artists}
        </h6>

        <p id="DAlbum">
          {props.album}
        </p>

        <button
          id="DPlay"
          onClick={() => {
            props.onClick();
            props.closeWindow();
          }}
        >
          Play Now
        </button>

      </div>

    </div>
  );
}