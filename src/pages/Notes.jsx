import React, { Component } from "react";
 
class Notes extends Component {
  render() {
    return (
      <div className="frame">
        <h2>External Notes</h2>
        <h3>Scheduling: <a href="http://perugini.cps.udayton.edu/teaching/courses/cps346/lecture_notes/scheduling.html"> http://perugini.cps.udayton.edu/teaching/courses/cps346/lecture_notes/scheduling.html</a></h3>

        <h3>Semaphores: <a href="http://perugini.cps.udayton.edu/teaching/courses/cps346/lecture_notes/semaphores.html"> http://perugini.cps.udayton.edu/teaching/courses/cps346/lecture_notes/semaphores.html</a></h3>

        {/* <h3>WWW: <a href="http://perugini.cps.udayton.edu/teaching/courses/cps346/lecture_notes/scheduling.html"> http://perugini.cps.udayton.edu/teaching/courses/cps346/lecture_notes/scheduling.html</a></h3> */}
      </div>
    );
  }
}
 
export default Notes;


// WEBPACK FOOTER //
// ./src/pages/Notes.js