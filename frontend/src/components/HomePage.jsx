import React, { useEffect, useState, useRef } from 'react';
import Footer from './Footer'
import SongBox from './SongBox'
import Artist from './Artist'
import Top5Song from './top5Song'
import './HomePage.css';


export default function HomePage(props) {
        const [current, setCurrent] = useState(0);
        const top10Ref = useRef(null);
        const artistRef = useRef(null);
        const exploreRef = useRef(null);
        const [fade, setFade] = useState(false);

        const scroll = (ref, direction) => {
            if (!ref.current) return;

            ref.current.scrollBy({
                left: direction === "left" ? -300 : 300,
                behavior: "smooth",
            });
        };

    // RESET CURRENT IF ARRAY CHANGES
    useEffect(() => {

        if (
            current >= props.topsongs?.length
        ) {
            setCurrent(0);
        }

    }, [props.topsongs, current]);

    

    // NEXT
    const nextSong = () => {

        if (!props.topsongs?.length) return;
        setFade(true);

        setTimeout(() => {
            setCurrent(prev =>
                prev >= props.topsongs.length - 1
                    ? 0
                    : prev + 1
            );

            setFade(false);
        }, 350);
    };



    // PREVIOUS
    const prevSong = () => {

        if (!props.topsongs?.length) return;
        setFade(true);

        setTimeout(() => {
            setCurrent(prev =>
                prev <= 0
                    ? props.topsongs.length - 1
                    : prev - 1
            );

            setFade(false);
        }, 350);
    };



    useEffect(() => {
        if (!props.topsongs?.length) return;

        const interval = setInterval(() => {

            setFade(true);

            setTimeout(() => {
                setCurrent(prev =>
                    prev >= props.topsongs.length - 1
                        ? 0
                        : prev + 1
                );

                setFade(false);

            }, 350);

        }, 60000);

        return () => clearInterval(interval);

    }, [props.topsongs]);

  return (
    <div className='HomePage'>

        {props.topsongs?.[current] && (

            <Top5Song

                prevSong={prevSong}
                nextSong={nextSong}

                onClick={() =>
                    props.onClick1(props.topsongs[current].id)
                }

                image={props.topsongs[current].img}

                number={(current + 1)
                    .toString()
                    .padStart(2, '0')}

                s_name={props.topsongs[current].englishName}

                a_name={props.topsongs[current].artist}
                fade={fade}

            />

        )}
        <div id="top10">
            <div id="top10_headding">
                <h1 class="heading"><span>Top 10 Trending Songs</span>
                    <div>
                        <i
                            className="bi bi-arrow-left-short"
                            id="pop_song_left1"
                            onClick={() => scroll(top10Ref, "left")}
                        ></i>

                        <i
                            className="bi bi-arrow-right-short"
                            id="pop_song_right1"
                            onClick={() => scroll(top10Ref, "right")}
                        ></i>
                    </div>
                </h1>
            </div>
            <div id="btn_c_top10" ref={top10Ref}>
                {props.songs?.map((song_data, i) => (
                    <React.Fragment key={song_data.id}>

                        <h1 className="sr_numbar">
                            {(i + 1).toString().padStart(2, '0')}
                        </h1>

                        <SongBox
                            s_img={song_data.img}
                            onClick={() => props.onClick1(song_data.id)}
                            s_name={song_data.englishName}
                            a_name={song_data.artist}
                        />

                    </React.Fragment>
                ))}
            </div>
        </div>
        <div id="artists">
            <div id="a_headding">
                <h1 className='heading'><span>Artist</span>
                    <div>
                        <i
                            className="bi bi-arrow-left-short"
                            id="pop_song_left1"
                            onClick={() => scroll(artistRef, "left")}
                        ></i>

                        <i
                            className="bi bi-arrow-right-short"
                            id="pop_song_right1"
                            onClick={() => scroll(artistRef, "right")}
                        ></i>
                    </div>
                </h1>
            </div>
            <div id="astist_c" ref={artistRef}>
                {
                    props.artists?.map((aData)=>(
                        <Artist 
                            key={aData.id}
                            onClick={()=> props.onClick2(aData.id)}
                            a_img={aData.img}
                            a_name={aData.Name}
                        />
                    ))
                }
            </div>
        </div>
        <div id="explore">
            <div id="e_headding">
                <h1 class="heading"><span>Explore Songs</span>
                    <div>
                        <i
                            className="bi bi-arrow-left-short"
                            id="pop_song_left1"
                            onClick={() => scroll(exploreRef, "left")}
                        ></i>

                        <i
                            className="bi bi-arrow-right-short"
                            id="pop_song_right1"
                            onClick={() => scroll(exploreRef, "right")}
                        ></i>
                    </div>
                </h1>
            </div>
            <div id="e_song" ref={exploreRef}>
                {props.eSongs?.map((song_data) => (
                    <SongBox
                    key={song_data.id}
                    s_img={song_data.img}
                    onClick={() => props.onClick1(song_data.id)}
                    s_name={song_data.englishName}
                    a_name={song_data.artist}
                    />
                ))}

            </div>
        </div>
        <Footer />
    </div>
  )
}
