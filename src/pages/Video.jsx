import React, { Component } from "react";

class Video extends Component {
  render() {
    return (
      <div className="frame">
        <h2>Project Demo Video</h2>
        <h3>Version 1</h3>
        <object width="640" height="360"
          data="https://www.youtube.com/embed/eRU8h-5aMOs">
        </object>
        <br/>
        <br/>
        <h3>Version 2 (may be unavailable)</h3>
        <video width="640" height="360" controls>
            <source src="/video.mp4" type="video/mp4"/>
            Your browser does not support the video tag.
        </video>
      </div>
    );
  }
}
 
export default Video;