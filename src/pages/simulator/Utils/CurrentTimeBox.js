import React, { Component } from "react";
import "./CurrentTimeBox.css"

class CurrentTimeForm extends Component {
    constructor(props) {
      super(props);
      this.state = {value: props.time};
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);

      this.UpdateTime = this.UpdateTime.bind(this);
    }

    UpdateTime(time) {
      this.setState({value: time});
    }
  
    handleChange(event) {
      this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
    //   alert('The simulator time will be set to: ' + this.state.value);
      event.preventDefault();
      this.props.onChange(this.state.value); 
    }
  
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          {/* <label className="pad"> */}
            {/* <h2 className="fixed-TB">{"Simulation Time: " }</h2> */}
            <input className="TimeInput" type="number" 
                value={this.state.value} onChange={this.handleChange} />
          {/* </label> */}
          
          {/* <input type="submit" value="Go" /> */}
        </form>
      );
    }
  }

  export default CurrentTimeForm;


// WEBPACK FOOTER //
// ./src/pages/simulator/Utils/CurrentTimeBox.js