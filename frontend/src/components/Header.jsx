import React, { useState , useEffect} from 'react';
import hlogo from '../data/hlogo.png';
import SearchItem from './serchItem';
import ArtistSearchItem from './serchAitem';
import axios from "axios";
import './Header.css'

export default function Header(props) {

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const allSongs = props.allSongs || [];

  const [showAuth, setShowAuth] = useState(false);

  const [listOpen, setListOpen] = useState(false);

  const [isLogin, setIsLogin] = useState(true);

  // later backend se replace karna
  const [user, setUser] = useState(null);


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    image: null
  });

  //const [preview, setPreview] = useState("");

  const handleChange = (e) => {

    const { name, value, files } = e.target;

    // IMAGE
    if(name === "image"){

        const file = files[0];

        setFormData({
            ...formData,
            image: file
        });

        // PREVIEW
        // setPreview(URL.createObjectURL(file));
    }

    else{

        setFormData({
            ...formData,
            [name]: value
        });
    }
  };
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (isLogin) {

        const res = await axios.post(
          "https://mixora-v3cw.onrender.com/auth/login",
          {
            email: formData.email,
            password: formData.password
          }
        );

        localStorage.setItem(
          "token",
          res.data.token
        );
        localStorage.setItem(
          "userId",
          res.data.user.id
        );

        localStorage.setItem(
          "userName",
          res.data.user.username
        );

        setUser({
          name: res.data.user.username,
          email: res.data.user.email,
          image: ""
        });

        alert("Login Successful");

      } else {

        await axios.post(
          "https://mixora-v3cw.onrender.com/auth/register",
          {
            username: formData.name,
            email: formData.email,
            password: formData.password
          }
        );

        alert("Account Created");

        setIsLogin(true);
      }

      setShowAuth(false);

    } catch (err) {

      console.log(err);

      alert(
        err.response?.data?.error ||
        "Something went wrong"
      );
    }
  };

  // LOGOUT
  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");

    setUser(null);

    props.setPSongs([]);

  };

  const { fetchPlaylist, setPSongs } = props;

  useEffect(() => {
    if (!user) {
      setPSongs([]);
      return;
    }

    fetchPlaylist();
  }, [user, fetchPlaylist, setPSongs]);


  useEffect(() => {

    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("userName");

    if (token && userName) {
      setUser({
        name: userName
      });
    }

  }, []);

  const filteredSongs =
    query.trim() === ""
      ? []
      : allSongs.filter((song) => {

          const title =
            song?.englishName ||
            "";

          const hindi =
            song?.hindiName ||
            "";

          const urdu =
            song?.urduName ||
            "";

          const artist =
            song?.artist ||
            "";

          return (
            title.toLowerCase().includes(query.toLowerCase()) ||
            hindi.toLowerCase().includes(query.toLowerCase()) ||
            urdu.toLowerCase().includes(query.toLowerCase()) ||
            artist.toLowerCase().includes(query.toLowerCase())
          );

        });

  const artists = props.artists || [];
  const filteredArtists = 
    query.trim() === ""
      ? []
      : artists.filter(artist => 
        artist.Name.toLowerCase().includes(query.toLowerCase())
      )

  const colors = [
    "#8b5cf6",
    "#ef4444",
    "#22c55e",
    "#3b82f6",
    "#f59e0b",
  ];

  const avatarColor =
  colors[(user?.name?.charCodeAt(0) || 0) % colors.length];

  // const userName = localStorage.getItem("userName");
  // const isLoggedIn = !!localStorage.getItem("token");

  const toggleList = ()=>{
    let listDisplay = document.getElementById('header_userbox');
    if (listOpen) {
      listDisplay.style.right = '-70vw';
    } else{
      listDisplay.style.right = '0px';
    }
    setListOpen(!listOpen);
  }

  useEffect(()=>{
    let listDisplay = document.getElementById('header_userbox');
    if (listDisplay.style.right === '0px') {
      setListOpen(true);
    }
    else{
      setListOpen(false);
    }
  }, []);

  return (
    <>
      <div className='Header'>

        <img src={hlogo} alt="" id="hlogo" />

        <i className={!(listOpen)? "bi bi-list": "bi bi-view-list"} id='list' onClick={toggleList}></i>
            {/* SEARCH */}
          <div id="serch_list_page">
            <div id="hsearch_bar_c">

              <input
                type="text"
                id="hsearch_bar"
                placeholder="Write Song Name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />

              <i className="bi bi-search"></i>

              {/* SEARCH RESULTS */}
              {
                query && (
                  <div className="searchDropdown">

                    {
                      (filteredSongs.length > 0 && filteredArtists.length > 0) ? (
                        <>
                          {filteredArtists.map((artist) => (
                            <ArtistSearchItem
                              key={artist.id}
                              img={artist.img}
                              name={artist.Name}
                              onClick={() => {
                                props.onSelectArtist(artist.id);
                                setQuery("");
                              }}
                            />
                          ))}
                          {filteredSongs.map((song) => (
                            <SearchItem
                              key={song.id}
                              img={song.img}
                              name={song.englishName}
                              artist={song.artist}
                              onClick={() => {
                                props.onSelectSong(song.id);
                                setQuery("");
                              }}
                            />
                          ))}
                        </>
                      ) : filteredSongs.length > 0 ? (
                        filteredSongs.map((song) => (
                          <SearchItem
                            key={song.id}
                            img={song.img}
                            name={song.englishName}
                            artist={song.artist}
                            onClick={() => {
                              props.onSelectSong(song.id);
                              setQuery("");
                            }}
                          />
                        ))
                      ): filteredArtists.length > 0 ? (
                        filteredArtists.map((artist) => (
                          <ArtistSearchItem
                            key={artist.id}
                            img={artist.img}
                            name={artist.Name}
                            onClick={() => {
                              props.onSelectArtist(artist.id);
                              setQuery("");
                            }}
                          />
                        ))
                      ) :  (
                        <p className="noResult">No Songs Found</p>
                      )
                    }

                  </div>
                )
              }

            </div>
          </div>
          <div id="header_userbox">

            {/* USER */}
            
            <div id="userBox">

              <div
                id="user"
                onClick={() => setOpen(!open)}
              >

                {user ? (
                          <>
                            <div
                              className="avatar-circle"
                              style={{ background: avatarColor }}
                            >
                              {user.name.charAt(0).toUpperCase()}
                            </div>

                            <h4 id="username">
                              {user.name}
                            </h4>
                          </>
                        ) : (
                          <>
                            <i className="bi bi-person-circle"></i>

                            <h4 id="username">
                              Guest
                            </h4>
                          </>
                        )}

                <i className={`bi bi-caret-down-fill ${open ? "rotate" : ""}`}></i>
              </div>

              <div className={`dropdown ${open ? 'show' : ''}`}>

                {
                  !user ? (

                    <div className="dropItem">
                      <i className="bi bi-box-arrow-in-right"></i>

                      <span
                        className="signBtn"
                        onClick={() => setShowAuth(true)}
                      >
                        Login / Sign Up
                      </span>
                    </div>

                  ) : (

                    <div className="dropItem">
                      <i className="bi bi-box-arrow-right"></i>

                      <span
                        className="logoutBtn"
                        onClick={handleLogout}
                      >
                        Logout
                      </span>
                    </div>

                  )
                }
                <div className="dropItem">
                  <i className="bi bi-stars"></i>
                  <span>Get Plus</span>
                </div>

                <div className="dropItem">
                  <i className="bi bi-download"></i>
                  <span>Download App</span>
                </div>

                <div className="dropItem">
                  <i className="bi bi-gear"></i>
                  <span>Settings</span>
                </div>

              </div>

            </div>
        </div>
      </div>
      {/* AUTH POPUP */}
      {
        showAuth && (

            <div className="authPopup">

                <div className="authBox">

                    {/* CLOSE */}
                    <i
                        className="bi bi-x-lg closeAuth"
                        onClick={() => setShowAuth(false)}
                    ></i>

                    <h2>
                        {
                            isLogin
                                ? "Welcome Back"
                                : "Create Account"
                        }
                    </h2>

                    <form onSubmit={handleSubmit}> 

                      {/* EMAIL */}

                    <div id="otherDetail">
                      
                      {
                        !isLogin && (
                          /* NAME */

                            <input
                                type="text"
                                placeholder="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        )
                      }
                      <input
                          type="email"
                          placeholder="Email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                      />

                      {/* PASSWORD */}

                      <input
                          type="password"
                          placeholder="Password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                      />

                      <button type="submit">

                          {
                              isLogin
                              ? "Sign In"
                              : "Create Account"
                          }

                      </button>
                    </div>

                  </form>

                    <p>

                        {
                            isLogin
                                ? "Don't have account?"
                                : "Already have account?"
                        }

                        <span
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {
                                isLogin
                                    ? " Create Account"
                                    : " Sign In"
                            }
                        </span>

                    </p>

                </div>

            </div>
        )
      }
    </>
  );
}
