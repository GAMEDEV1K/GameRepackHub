import Link from 'next/link'
import { config } from '../lib/config'

const Footer = () => {
  return (
    <footer className="relative py-16 border-t border-game-light-gray/20 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-game-darker to-black opacity-80"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-game-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-game-blue/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-5 text-white relative inline-flex items-center">
              <span className="absolute -left-3 top-0 bottom-0 w-1 bg-game-accent rounded-full"></span>
              About GameRipple
            </h3>
            <p className="text-gray-300 leading-relaxed">
              GameRipple is a modern web platform designed to provide gamers with easy access to 
              pre-installed, compressed PC game downloads with no installation hassle.
            </p>
            <div className="mt-6 flex items-center">
              <div className="relative w-10 h-10 mr-3">
                <div className="absolute inset-0 bg-game-accent/20 rounded-full blur-sm"></div>
                <img src="/images/logo.svg" alt="GameRipple Logo" className="w-full h-full object-contain relative z-10" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-game-accent to-game-neon">GameRipple</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-5 text-white relative inline-flex items-center">
              <span className="absolute -left-3 top-0 bottom-0 w-1 bg-game-accent rounded-full"></span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/browse" className="text-gray-300 hover:text-game-accent transition-all duration-300 flex items-center group">
                  <span className="w-1.5 h-1.5 rounded-full bg-game-accent/50 mr-2 group-hover:bg-game-accent group-hover:scale-125 transition-all duration-300"></span>
                  Browse Games
                </Link>
              </li>
              <li>
                <Link href="/top-games" className="text-gray-300 hover:text-game-accent transition-all duration-300 flex items-center group">
                  <span className="w-1.5 h-1.5 rounded-full bg-game-accent/50 mr-2 group-hover:bg-game-accent group-hover:scale-125 transition-all duration-300"></span>
                  Top PC Games
                </Link>
              </li>
              <li>
                <Link href="/new-releases" className="text-gray-300 hover:text-game-accent transition-all duration-300 flex items-center group">
                  <span className="w-1.5 h-1.5 rounded-full bg-game-accent/50 mr-2 group-hover:bg-game-accent group-hover:scale-125 transition-all duration-300"></span>
                  New Releases
                </Link>
              </li>
              <li>
                <Link href="/request-game" className="text-gray-300 hover:text-game-accent transition-all duration-300 flex items-center group">
                  <span className="w-1.5 h-1.5 rounded-full bg-game-accent/50 mr-2 group-hover:bg-game-accent group-hover:scale-125 transition-all duration-300"></span>
                  Request a Game
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xl font-bold mb-5 text-white relative inline-flex items-center">
              <span className="absolute -left-3 top-0 bottom-0 w-1 bg-game-accent rounded-full"></span>
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-game-accent transition-all duration-300 flex items-center group">
                  <span className="w-1.5 h-1.5 rounded-full bg-game-accent/50 mr-2 group-hover:bg-game-accent group-hover:scale-125 transition-all duration-300"></span>
                  Contact Us
                </Link>
              </li>
              <li>
                <a href={`mailto:${config.contactEmail}`} className="text-gray-300 hover:text-game-accent transition-all duration-300 flex items-center group">
                  <span className="w-1.5 h-1.5 rounded-full bg-game-accent/50 mr-2 group-hover:bg-game-accent group-hover:scale-125 transition-all duration-300"></span>
                  {config.contactEmail}
                </a>
              </li>
              <li>
                <a href={config.discordLink} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-game-accent transition-all duration-300 flex items-center group">
                  <span className="w-1.5 h-1.5 rounded-full bg-game-accent/50 mr-2 group-hover:bg-game-accent group-hover:scale-125 transition-all duration-300"></span>
                  Discord Community
                </a>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-game-accent transition-all duration-300 flex items-center group">
                  <span className="w-1.5 h-1.5 rounded-full bg-game-accent/50 mr-2 group-hover:bg-game-accent group-hover:scale-125 transition-all duration-300"></span>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/troubleshoot" className="text-gray-300 hover:text-game-accent transition-all duration-300 flex items-center group">
                  <span className="w-1.5 h-1.5 rounded-full bg-game-accent/50 mr-2 group-hover:bg-game-accent group-hover:scale-125 transition-all duration-300"></span>
                  Troubleshooting
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xl font-bold mb-5 text-white relative inline-flex items-center">
              <span className="absolute -left-3 top-0 bottom-0 w-1 bg-game-accent rounded-full"></span>
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-game-accent transition-all duration-300 flex items-center group">
                  <span className="w-1.5 h-1.5 rounded-full bg-game-accent/50 mr-2 group-hover:bg-game-accent group-hover:scale-125 transition-all duration-300"></span>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-game-accent transition-all duration-300 flex items-center group">
                  <span className="w-1.5 h-1.5 rounded-full bg-game-accent/50 mr-2 group-hover:bg-game-accent group-hover:scale-125 transition-all duration-300"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-gray-300 hover:text-game-accent transition-all duration-300 flex items-center group">
                  <span className="w-1.5 h-1.5 rounded-full bg-game-accent/50 mr-2 group-hover:bg-game-accent group-hover:scale-125 transition-all duration-300"></span>
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/dmca" className="text-gray-300 hover:text-game-accent transition-all duration-300 flex items-center group">
                  <span className="w-1.5 h-1.5 rounded-full bg-game-accent/50 mr-2 group-hover:bg-game-accent group-hover:scale-125 transition-all duration-300"></span>
                  DMCA
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div className="mt-12 glass-card p-6 border border-game-light-gray/30 relative overflow-hidden">
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-game-accent/5 rounded-full blur-xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h4 className="text-amber-400 font-bold text-lg">LEGAL DISCLAIMER</h4>
            </div>
            <p className="text-gray-300 text-center mb-4 max-w-3xl mx-auto">
              GameRipple is an informational platform that provides reviews, news, and information about video games. 
              All materials presented on this site are provided exclusively for informational and educational purposes. 
              We do not support or encourage piracy or unauthorized distribution of video games or other copyrighted materials.
            </p>
            <div className="flex justify-center">
              <Link href="/disclaimer" className="btn-outline text-sm inline-flex items-center gap-2 group">
                <span>Read Full Disclaimer</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-game-light-gray/20 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 mr-2">
              <img src="/images/logo.svg" alt="GameRipple Logo" className="w-full h-full" />
            </div>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-game-accent to-game-neon">GameRipple</span>
          </div>
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} GameRipple. All rights reserved.
          </p>
          <div className="mt-6 flex justify-center space-x-6">
            <a href={config.discordLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-game-gray/50 rounded-lg border border-game-light-gray/30 text-gray-300 hover:border-game-accent/50 hover:text-game-accent transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z" />
              </svg>
              <span className="text-sm font-medium">Discord Community</span>
            </a>
            <a href={`mailto:${config.contactEmail}`} className="flex items-center gap-2 px-4 py-2 bg-game-gray/50 rounded-lg border border-game-light-gray/30 text-gray-300 hover:border-game-accent/50 hover:text-game-accent transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">Contact Us</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
