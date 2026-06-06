import React from "react";
import "./Toggle.css"

export class Toggle extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isToggleOn: true
      };
      this.OnTxt = props.on;
      this.OffTxt = props.off;
      this.className = props.className;
  
      // This binding is necessary to make `this` work in the callback
      this.handleClick = this.handleClick.bind(this);
      this.GetToggleState = this.GetToggleState.bind(this);
    }

    GetToggleState() {
      return this.state.isToggleOn;
    }
  
    handleClick() {
      this.setState(prevState => ({
        isToggleOn: !prevState.isToggleOn,
      }));
    }
  
    render() {
      return (
        <button className="ToggleBigFont" onClick={this.handleClick}>
          {this.state.isToggleOn ? this.OnTxt : this.OffTxt}
        </button>
      );
    }
}

export class HandleToggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isToggleOn: props.initial
    };
    this.OnTxt = props.on;
    this.OffTxt = props.off;
    this.className = props.className;

    this.handleClick = this.handleClick.bind(this);
  }
  
  handleClick() {
    this.props.handleClick(!this.state.isToggleOn); 
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn,
    }));

  }
  
  render() {
    return (
      <button className={this.className} onClick={this.handleClick}>
        {this.state.isToggleOn ? this.OnTxt : this.OffTxt}
      </button>
    );
  }
}

  export class SingleToggle extends React.Component {
    constructor(props) {
      super(props);
      this.amount = props.amount;
      this.className = props.className;
      this.parent = props.parent;
  
      // This binding is necessary to make `this` work in the callback
      this.handleClick = this.handleClick.bind(this);
      this.GetToggleState = this.GetToggleState.bind(this);
    }

    GetToggleState() {
      return this.state.isToggleOn;
    }
  
    handleClick() {
      this.parent.setState(prevState => ({
        runfor: this.amount 
      }));
    }
  
    render() {
      return (
        <button className={this.className} onClick={this.handleClick}>
          {this.amount}
        </button>
      );
    }
  }

  // export default SingleToggle;
  export default Toggle;


// WEBPACK FOOTER //
// ./src/pages/simulator/Utils/Toggle.js