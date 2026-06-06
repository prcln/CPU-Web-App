import React, { Component } from "react";
 
class Download extends Component {
  render() {
    return (
      <div className="frame">
        <h2>Download and run this tool locally!</h2>

        <div class="mv5">
            <h3 class="f3 fw7">Check that you have node and npm installed:</h3>
            <p class="lh-copy">To check if you have Node.js installed, run this command in your terminal:</p>
            <pre><code>node -v</code></pre>
            <p class="lh-copy">To confirm that you have npm installed you can run this command in your terminal:</p>
            <pre><code>npm -v</code></pre>
        </div>

        {/* <p>You will need node.js, npm, and serve installed on your system.</p> */}

        <p>You can download node.js and npm from <a href="https://www.npmjs.com/get-npm">www.npmjs.com</a> </p>

        <h3>Check to make sure you have serve installed:</h3>
        <code>serve -v</code><br/>
        <p>If you do not have serve, run:</p>
        <code>npm install -g serve</code><br/>

        <h3>Run the following commands:</h3>
        <code>git clone https://bitbucket.org/jwb_research/cpu-web-app.git</code><br/>
        <br/>
        <code>cd cpu-web-app</code><br/>
        <br/>
        <code>serve</code><br/>
      </div>
    );
  }
}
 
export default Download;


// WEBPACK FOOTER //
// ./src/pages/Download.js