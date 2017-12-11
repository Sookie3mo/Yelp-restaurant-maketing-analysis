import React from 'react';

const style = {
  position: "absolute",
  bottom: "0",
  padding: "10px",
  background: "rgba(255, 255, 255, 0.8)",
  textTransformation: "capitalize",
  textAlign: "center",
  verticalAlign: "middle",
  fontSize: "18px",
  width: "100%",
  zIndex: "10",
  fontWeight: "bold",
};

export default function({children}) {
  return (
    <div style={style}>
      {children}
    </div>
  )
}
