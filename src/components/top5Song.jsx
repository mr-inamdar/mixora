import React from 'react'
import './top5Song.css'
// import { motion, AnimatePresence } from "framer-motion";

export default function Top5Song(props) {

  return (
    <div id="top5Song">

        <button
            id="left"
            className="normal"
            onClick={props.prevSong}
        >
            &#10094;
        </button>

        <button
            id="right"
            className="normal"
            onClick={props.nextSong}
        >
            &#10095;
        </button>

        <img
            src={props.image}
            alt=""
            id="poster_pic"
            className={`top-song-img ${props.fade ? "fade" : ""}`}
        />

        {/* <motion.img
        key={props.image}
        src={props.image}
        className="top-song-img"
        initial={{
            opacity: 0,
            scale: 0.8,
            filter: "blur(20px)"
        }}
        animate={{
            opacity: 1,
            scale: 1,
            filter: "blur(0px)"
        }}
        exit={{
            opacity: 0,
            scale: 1.15,
            filter: "blur(20px)"
        }}
        transition={{
            duration: 0.45
        }}
        /> */}

        <li className="trending_song_item">

            <span>{props.number}</span>

            <img src={props.image} alt="" className={`${props.fade ? "" : "song-image"}`} />
        
            <h5>
                {props.s_name}

                <div className="subtitel">
                    {props.a_name}
                </div>
            </h5>

            <i
                className="bi playbutton bi-play-fill"
                onClick={props.onClick}
            ></i>

        </li>

    </div>
  )
}
