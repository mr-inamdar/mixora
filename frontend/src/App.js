import './App.css';
import { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';

// Components
import Playlist from './components/Playlist';
import HomePage from './components/HomePage';
import StetusBar from './components/StetusBar';
import Header from './components/Header';
import SongDetails from './components/SongDetails';
import ArtistsSongs from './components/ArtistsSongs';
import NowPlaying from './components/NowPlaying';

// JSON Data
import artistdata from './data/artistdata.json';

function App() {
  // Songs & Artists Lists States
  const [artists, setArtists] = useState([]);
  const [pSongs, setPSongs] = useState([]);
  const [allSongs, setAllSongs] = useState([]);
  const [artistSong, setArtistSong] = useState([]);
  const [currArtistIdx, setCurrArtistIdx] = useState(null);

  // Navigation & Popup States
  const [currentPopupIdx, setCurrentPopupIdx] = useState(null);
  const [showAddSong, setShowAddSong] = useState(false);

  // Form States (Upload & Auth)
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [urduName, setUrduName] = useState("");
  const [hindiName, setHindiName] = useState("");
  const [songFile, setSongFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");

  // UI View States
  const [showPlayer, setShowPlayer] = useState(false);
  const [showSongPage, setShowSongPage] = useState(false);

  // Centralized Audio States
  const [currPlayIdx, setCurrPlayIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [repeatOne, setRepeatOne] = useState(false);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  // const [myPlaylist, setMyPlaylist] = useState([]);
  const music_ref = useRef(null);

  const [searchbar, setSearchbar] = useState(false);
  const [accountPage, setAccountPage] = useState(false);
  const [homePage, setHomePage] = useState(true);
  const [playlistPage, setPlaylistPage] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 499);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 499);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const loadSongs = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5001/songs"
      );

      setAllSongs(res.data);

    } catch(err){

      console.log(err);

    }

  };
  const fetchPlaylist = async () => {
    try {
      const res = await axios.get(
        "https://mixora-v3cw.onrender.com/playlist/my",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setPSongs(res.data?.Songs || []);
    } catch (err) {
      console.log(err);
      setPSongs([]);
    }
  };

  useEffect(() => {

    loadSongs();

    if (localStorage.getItem("token")) {
      // loadMyPlaylist();
      fetchPlaylist();
    }

  }, []);

  // Load Data on Mount
  useEffect(() => {
    setArtists(artistdata);
  }, []);


  const currentSongList = allSongs;
  const currentSong = allSongs[currPlayIdx];


  const playSong = (id) => {

    const currentIdx = allSongs.findIndex(
      song => song.id === id
    );
    setCurrPlayIdx(currentIdx);

    setCurrentPopupIdx(null);
    setShowPlayer(true);
    setIsPlaying(true);
  };

  const active_popup = (id) => {

    const currentIdx = allSongs.findIndex(
      song => song.id === id
    );

    setCurrentPopupIdx(currentIdx);
  };

  const closeWindow = () => setCurrentPopupIdx(null);

  const show_artist_detail = (id) => {
    const filteredSongs = allSongs.filter(song => 
      song.artist.toLowerCase().includes(artists[parseInt(id)].Name.toLowerCase())
    );
    setArtistSong(filteredSongs);
    setCurrArtistIdx(parseInt(id));
  };

  const closeAWindow = () => {
    setArtistSong([]);
    setCurrArtistIdx(null);
  };

  const uploadSong = async (e) => {
    if (!localStorage.getItem("userId")) {
      alert("Login required");
      return;
    }
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Login required");
      return;
    }

    try {

      setUploading(true);
      setUploadProgress(0);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("artist", artist);
      formData.append("album", album);
      formData.append("urduName", urduName);
      formData.append("hindiName", hindiName);
      formData.append("song", songFile);
      formData.append("image", imageFile);

      await axios.post(
        "https://mixora-v3cw.onrender.com/songs/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },

          onUploadProgress: (progressEvent) => {

            const percent = Math.round(
              (progressEvent.loaded * 100) /
              progressEvent.total
            );

            setUploadProgress(percent);
          }
        }
      );

      setUploadProgress(100);

      alert("Song Uploaded Successfully");

      await loadSongs();

      setShowAddSong(false);

    } catch (err) {

      console.log(err);
      alert("Upload Failed");

    } finally {

      setUploading(false);

    }
  };

  // Shared Audio Controls Handlers
  const handlePlayPause = () => {
    const audio = music_ref.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(err => console.log("Playback error:", err));
      setIsPlaying(true);
    }
  };

  const handleNext = useCallback(() => {
    if (currentSongList.length === 0) return;
    setCurrPlayIdx((prev) => (prev + 1) % currentSongList.length);
  }, [currentSongList]);

  const handlePrev = () => {
    if (currentSongList.length === 0) return;
    setCurrPlayIdx((prev) => (prev === 0 ? currentSongList.length - 1 : prev - 1));
  };

  const handleSeek = (e) => {
    const targetTime = e.target.value;
    if (music_ref.current) {
      music_ref.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const handleVolumeChange = (e) => {
    const val = e.target.value;
    setVolume(val);
    if (music_ref.current) {
      music_ref.current.volume = val / 100;
    }
  };

  // Audio lifecycle effects
  useEffect(() => {
    const audio = music_ref.current;
    if (!audio) return;

    audio.load();
    setCurrentTime(0);

    if (isPlaying) {
      audio.play().catch(err => console.log("Playback error:", err));
    }
  }, [currPlayIdx, isPlaying]);

  useEffect(() => {
    const audio = music_ref.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const setMeta = () => setDuration(audio.duration);
    
    const handleEnd = () => {
      if (repeatOne) {
        audio.currentTime = 0;
        audio.play().catch(err => console.log(err));
      } else {
        handleNext();
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', setMeta);
    audio.addEventListener('ended', handleEnd);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', setMeta);
      audio.removeEventListener('ended', handleEnd);
    };
  }, [repeatOne, handleNext]);

  const deleteSong = async (id, uploadedBy) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    // Not logged in
    if (!token || !userId) {
      alert("Please login first");
      return;
    }


    try {
      await axios.delete(`https://mixora-v3cw.onrender.com/songs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await loadSongs();

    } catch (err) {
      console.log(err);
    }
  };

  const showUploadSongPopup = ()=>{
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Please login first");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }


    // Upload API call
    setShowAddSong(true);
  }
  const addToPlaylist = async (songId) => {

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Login first");
      return;
    }

    await axios.post(
      "https://mixora-v3cw.onrender.com/playlist/add",
      { songId },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    fetchPlaylist();
  };

  const toggleSearchBar = ()=>{
    document.getElementById('header_userbox').style.right = '-70vw';
    let searchbar_container = document.getElementById('serch_list_page');
    if (searchbar) {
      searchbar_container.style.top = '0px';
    }
    else{
      searchbar_container.style.top = '-91vh';
    }
    setSearchbar(!searchbar);
  }

  const toggleAccountPage = ()=>{
    document.getElementById('serch_list_page').style.top = '-91vh';
    let header_userbox = document.getElementById('header_userbox');
    if (searchbar) {
      header_userbox.style.right = '0px';
    }
    else{
      header_userbox.style.right = '-70vw';
    }
    setAccountPage(!accountPage);
  }
  const toggleHomePage = ()=>{
    let homepage = document.getElementsByClassName('HomePage')[0];
    document.getElementById('header_userbox').style.right = '-70vw';
    document.getElementById('serch_list_page').style.top = '-91vh';
    document.getElementsByClassName('Playlist')[0].style.display = "none";

    if (!homePage && homepage.style.display === 'none') {
      homepage.style.display = "block";
      setHomePage(false);
    }
    else{
      homepage.style.display = "none";
      setHomePage(true);
    }
    // setHomePage(!homePage);
  }
  const togglePlaylist = ()=>{
    let playlist = document.getElementsByClassName('Playlist')[0];
    document.getElementById('header_userbox').style.right = '-70vw';
    document.getElementById('serch_list_page').style.top = '-91vh';
    document.getElementsByClassName('HomePage')[0].style.display = "none";

    if (!playlistPage && playlist.style.display === 'none') {
      playlist.style.display = "block";
      setPlaylistPage(false);
    }
    else{
      playlist.style.display = "none";
      setPlaylistPage(true);
    }
    // setPlaylistPage(!playlistPage);
  }

  return (
    <div className="App">
      <audio ref={music_ref} src={currentSong?.audio}></audio>

      <Header 
        allSongs={allSongs}
        onSelectSong={(id) => active_popup(id)}
        onSelectArtist={(id) => show_artist_detail(id)}
        artists={artists}
        fetchPlaylist={fetchPlaylist}
        setPSongs={setPSongs}
      />
      <div
        id="MainPage"
        style={{
          height: isMobile
            ? (showPlayer ? "calc(77% - 92px)" : "77%")
            : (showPlayer ? "calc(86% - 92px)" : "86%"),
        }}
      >
        <Playlist pSongs={pSongs} onClick={(id) => active_popup(id)} />
    
        {showSongPage && currentSong ? (
          <NowPlaying
            song={currentSong}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            repeatOne={repeatOne}
            setRepeatOne={setRepeatOne}
            handlePlayPause={handlePlayPause}
            handleNext={handleNext}
            handlePrev={handlePrev}
            handleSeek={handleSeek}
            addToPlaylist={(id) => addToPlaylist(id)}
            close={() => {
              setShowSongPage(false);
              setShowPlayer(true);
            }}
            deleteSong = {(id) => deleteSong(id)}
          />
        ) : artistSong && artistSong.length > 0 && currArtistIdx !== null ? (
          <ArtistsSongs
            closeAWindow={closeAWindow}
            songList={artistSong}
            onClick={(id) => active_popup(id)}
            img={artists[currArtistIdx].img}
            name={artists[currArtistIdx].Name}
          />
        ) : (
          <HomePage
            onClick1={(id) => active_popup(id)}
            onClick2={(id) => show_artist_detail(id)}
            artists={artists}
            topsongs={allSongs.slice(0, 5)}
            songs={allSongs.slice(5, 15)}
            eSongs={allSongs.slice(15)}
          />
        )}

        {currentPopupIdx !== null && (
          <div className='songPopup'>
            <SongDetails
              closeWindow={closeWindow}
              onClick={() =>
                playSong(
                  allSongs[currentPopupIdx]?.id
                )
              }
              img={allSongs[currentPopupIdx]?.img}
              name={
                allSongs[currentPopupIdx]?.englishName
              }
              artists={
                allSongs[currentPopupIdx]?.artist
              }
              album={
                allSongs[currentPopupIdx]?.album
              }
            />
          </div>
        )}
      </div>

      {currentSong && showPlayer && (
        <StetusBar 
          song={currentSong}
          songList={currentSongList}
          currPlayIdx={currPlayIdx}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          repeatOne={repeatOne}
          setRepeatOne={setRepeatOne}
          handlePlayPause={handlePlayPause}
          handleNext={handleNext}
          handlePrev={handlePrev}
          handleSeek={handleSeek}
          handleVolumeChange={handleVolumeChange}
          closePlayer={() => {
            setShowPlayer(false);
            setIsPlaying(false);
            if (music_ref.current) {
              music_ref.current.pause();
            }
          }} 
          openSongPage={() => {
            setShowSongPage(true);
            setShowPlayer(false);
          }}
        />
      )}
      <div id="mobileNevigetionOption">
        <div id="homeI" onClick={toggleHomePage}><i class="bi bi-house"></i></div>
        <div id="serchI" onClick={toggleSearchBar}><i class="bi bi-search"></i></div>
        <div id="playlistI" onClick={togglePlaylist}><i class="bi bi-music-note-list"></i></div>
        <div id="accountI" onClick={toggleAccountPage}><i class="bi bi-person-fill"></i></div>
      </div>
      {showAddSong && (
        <div className="popupOverlay">
          <div className="addSongPopup">
            
            {/* Left Blue Panel */}
            <div className="popupLeft">
              <div className="branding">
                <div className="logoPlaceholder"></div>
                <span>Mixora</span>
              </div>
              <h2>Upload Song</h2>
              <p>Fill in the details to upload your track. Make sure your audio and image files meet the platform requirements.</p>
              <div className="centerArrow"></div>
            </div>

            {/* Right Form Panel */}
            <div className="popupRight">
              <span className="closeBtn" onClick={() => setShowAddSong(false)}>✖</span>
              
              <div className="formTabs">
                <span className="activeTab">details</span>
                <span className="inactiveTab">upload</span>
              </div>

              <form onSubmit={uploadSong} id='detailform'>
                <div className="inputRow">
                  <span className="inputLabel">name</span>
                  <span className="inputArrow">›</span>
                  <input type="text" placeholder="Song Name" value={title} onChange={(e)=>setTitle(e.target.value)} required />
                </div>
                
                <div className="inputRow">
                  <span className="inputLabel">artist</span>
                  <span className="inputArrow">›</span>
                  <input type="text" placeholder="Artist Name" value={artist} onChange={(e)=>setArtist(e.target.value)} required />
                </div>

                <div className="inputRow">
                  <span className="inputLabel">album</span>
                  <span className="inputArrow">›</span>
                  <input type="text" placeholder="Album Name" value={album} onChange={(e)=>setAlbum(e.target.value)} />
                </div>

                <div className="inputRow">
                  <span className="inputLabel">urdu</span>
                  <span className="inputArrow">›</span>
                  <input type="text" placeholder="Urdu Name (Optional)" value={urduName} onChange={(e)=>setUrduName(e.target.value)} />
                </div>

                <div className="inputRow">
                  <span className="inputLabel">hindi</span>
                  <span className="inputArrow">›</span>
                  <input type="text" placeholder="Hindi Name (Optional)" value={hindiName} onChange={(e)=>setHindiName(e.target.value)} />
                </div>

                <div className="fileUploadRow">
                  <label>Audio File</label>
                  <input type="file" accept=".mp3,.wav,.m4a,audio/*" onChange={(e)=>setSongFile(e.target.files[0])} required />
                </div>

                <div className="fileUploadRow">
                  <label>Cover Art</label>
                  <input type="file" accept="image/*" onChange={(e)=>setImageFile(e.target.files[0])} required />
                </div>

                <div className="submitRow">

                  {
                    uploading && (
                      <div className="uploadStatus">

                        <div
                          className="uploadCircle"
                          style={{
                            '--progress': uploadProgress
                          }}
                        >
                          <span>{uploadProgress}%</span>
                        </div>

                        <div className="uploadInfo">

                          <h4>
                            {
                              uploadProgress === 100
                              ? "Processing File"
                              : "Uploading Track"
                            }
                          </h4>

                          <p>
                            {
                              uploadProgress === 100
                              ? "Almost Done..."
                              : "Please wait while we upload your music"
                            }
                          </p>

                        </div>

                      </div>
                    )
                  }
                  <button
                    type="submit"
                    className="uploadBtn"
                    disabled={uploading}
                  >
                    {
                      uploading
                        ? `Uploading ${uploadProgress}%`
                        : (
                          <>
                            upload
                            <span className="btnArrow">›</span>
                          </>
                        )
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <button className='addSong' onClick={() => showUploadSongPopup()}><i className="bi bi-plus"></i></button>
    </div>
  );
}

export default App;
