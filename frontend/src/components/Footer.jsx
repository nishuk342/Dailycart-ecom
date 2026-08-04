import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="footer"
    style={{
      background:'#09090b',
      borderTop:'1px solid rgba(255,255,255,0.05)',
      padding:'40px 20px',
      marginTop:'auto'
    }}>
      
      <div className="footer-content"
       style={{
        maxWidth:'1200px',
        margin:'0 auto',
        display:'flex',
        flexWrap:'wrap',
        justifyContent:'space-between',
        alignItems:'center',
        gap:'20px'
       }}>

        <div>
          <h3 style={{color:'#3b82f6', marginBottom:'10px'}}>DailyCart</h3>
          <p style={{color:'#a1a1aa', fontSize:'0.9rem'}}>Your Daily Shopping Platform.</p>
        </div>

        <div style={{display:'flex', gap:'20px'}}>
          <Link to="/about" style={{color:'#a1a1aa', fontSize:'0.9rem'}}>About</Link>
          <Link to="/return" style={{color:'#a1a1aa', fontSize:'0.9rem'}}>Return Policy</Link>
          <Link to="/disclaimer" style={{color:'#a1a1aa', fontSize:'0.9rem'}}>Disclaimer</Link>
        </div>

        <div style={{display:'flex', gap:'20px'}}>
          &copy; {new Date().getFullYear()} DailyCart. All Rights Reserved.
        </div>

      </div>
    </footer>
  )
}

export default Footer