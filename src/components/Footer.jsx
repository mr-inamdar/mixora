import React from 'react'
import './Footer.css'

export default function Footer() {
  return (
    <footer>

        <div id="links_container">

            {/* company */}

            <ul>
                <li><strong>Company</strong></li>
                <li>About</li>
                <li>Jobs</li>
                <li>For the Record</li>
            </ul>

            {/* communities */}

            <ul>
                <li><strong>Communities</strong></li>
                <li>For Artists</li>
                <li>Developers</li>
                <li>Advertising</li>
                <li>Investors</li>
                <li>Vendors</li>
            </ul>

            {/* useful links */}

            <ul>
                <li><strong>Useful Links</strong></li>
                <li>Support</li>
                <li>Free Mobile App</li>
                <li>Popular by</li>
                <li>Country</li>
                <li>Import your music</li>
            </ul>

            {/* plans */}

            <ul>
                <li><strong>Musiq Plans</strong></li>
                <li>Premium Individual</li>
                <li>Premium Duo</li>
                <li>Premium Family</li>
                <li>Premium Student</li>
                <li>Musiq Free</li>
            </ul>

            {/* social icons */}

            <div id="icons">

                <h2>Follow Me</h2>

                <div className="social_icons">

                    <a
                      href="https://www.instagram.com/_im,zeshan__/"
                      target="_blank"
                      rel="noreferrer"
                    >
                        <i className="bi bi-instagram"></i>
                    </a>

                    <a
                      href="https://github.com/mr-inamdar"
                      target="_blank"
                       rel="noreferrer"
                    >
                        <i className="bi bi-github"></i>
                    </a>

                    <a
                      href="https://www.linkedin.com/in/zeeshan-inamdar-349b95377/"
                      target="_blank"
                      rel="noreferrer"
                    >
                        <i className="bi bi-linkedin"></i>
                    </a>

                </div>

            </div>

        </div>

        <h3 id="copyright">
            © 2026 Mixora AB
        </h3>

    </footer>
  )
}
