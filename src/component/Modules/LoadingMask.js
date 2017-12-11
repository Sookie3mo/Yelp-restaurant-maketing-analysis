import React from 'react';

export default function (props) {
  return (
    <div className="fullScreenMask loadingMask">
        <div style={{margin: "auto", padding: "30px", display: "block", textAlign: "center", fontSize: "20px", color: "#fff", fontWeight: "bold"}}>
          ... FETCHING DATA
        </div>
        <div className='lmask'></div>
    </div>
  )
}
