import React, { Component } from "react";
import "./SimHeader.css";
import CurrentTimeForm from "./CurrentTimeBox";

// import Toggle from "./Toggle";
import { HandleToggle } from './Toggle';

import { Slider, Handles } from 'react-compound-slider'

// import { Handle } from './slidercomps';

// import SchedulerManager from "../implementation/SchedulerManager";

const sliderStyle = {  // Give the slider some width
    position: 'relative',
    width: '100%',
    height: 40,
    // marginTop: -15,
    // border: '1px solid steelblue',
  }
  
  const railStyle = { 
    position: 'absolute',
    width: '100%',
    // padding: 5,
    height: 10,
    marginTop: 20,
    borderRadius: 5,
    backgroundColor: '#8B9CB6',
  }

export function Handle({ // your handle component
    handle: { id, value, percent },
    getHandleProps
  }) {
    return (
      <div
        style={{
          left: `${percent}%`,
          position: 'absolute',
          marginLeft: -15,
          marginTop: 10,
          zIndex: 2,
          width: 30,
          height: 30,
          border: 0,
          textAlign: 'center',
          cursor: 'pointer',
          borderRadius: '50%',
          backgroundColor: '#2C4870',
          color: '#333',
        }}
        {...getHandleProps(id)}
      >
        {/* <div className="handle"> {value} </div> */}
        {/* <form onSubmit={handleSubmit}>

            <input className="handle" type="number" 
                value={value} onChange={onChange} />

        </form> */}
        {/* <CurrentTimeForm time={value} onChange={onChange}/>  */}
        {/* <div style={{ fontFamily: 'Roboto', fontSize: 11, marginTop: -35 }}>
          {value}
        </div> */}
      </div>
    )
}




class SimHeader extends Component {
    constructor(props) {
        super(props);

        this.time = this.props.Time;
        this.ignoreAlerts = this.props.ignorealerts;

        this.Run100 = this.Run100.bind(this);
        this.Reset = this.Reset.bind(this);
        this.Complete = this.Complete.bind(this);
        this.Run1 = this.Run1.bind(this);
        this.TimeChanged = this.TimeChanged.bind(this);
        this.SliderChangedTime = this.SliderChangedTime.bind(this);
        this.SliderUpdatedTime = this.SliderUpdatedTime.bind(this);
        this.ToggleAlerts = this.ToggleAlerts.bind(this);
        this.ViewToggle = this.ViewToggle.bind(this);
        this.lastEvent = this.lastEvent.bind(this);
        this.nextEvent = this.nextEvent.bind(this);
        this.ShowSettings = this.ShowSettings.bind(this);
    }

    ShowSettings() {
      // alert('Settings are temporarily disabled.');
      this.props.SettingsToggle();
    }

    ViewToggle(value) {
        this.props.ViewToggle(value);
    }

    ToggleAlerts(value) {
        // console.log(value)
        this.props.ToggleAlerts(value);
    }

    Run1() {
        this.props.Run(1);
    }

    Run100() {
        this.props.Run(100);
    }

    Reset() {
        this.props.Reset(0);
        this.ChangeTime(0);
    }

    Complete() {
      this.props.Reset(30000);
      this.ChangeTime(30000);
    }

    lastEvent() {
        this.props.lastEvent();
    }

    nextEvent() {
        this.props.nextEvent();
    }

    SliderUpdatedTime(timeArr) {
        var time = timeArr[0]
        // if (time < 0) {
        //     time = 0;
        // }
        // if (time > 30000) {
        //     time = 30000;
        // }
        this.TimeForm.UpdateTime(time);
    }

    SliderChangedTime(timeArr) {
        var time = timeArr[0]
        if (time < 0) {
            time = this.time === 0 ? 1 : 0;
        }
        if (time > 30000) {
            time = 30000;
        }
        this.TimeChanged(time);
        this.TimeForm.UpdateTime(time);
    }

    TimeChanged(time) {
        console.log(time);
        this.time = time;
        this.props.UpdateManger(time);
        // this.setState({time: time});
    }

    ChangeTime(time) {
        this.time = time;
        this.TimeForm.UpdateTime(time);
    }

    render() {
        return (
            <div className="SimHeader header-container">

          <div className="outer-header-column-one"> 

              <div className="header-column-one"> 
                <h2>{"Simulator" }</h2>
              </div>

              <div className="header-column-four"> 
                <HandleToggle className='BigFont'
                    handleClick = {this.ViewToggle}
                    off={'Hide Semaphore Queues'} 
                    on={'Show Semaphore Queues'}/>
              </div>

              <div className="header-column-seven">
                <HandleToggle className='BigFont'
                    handleClick = {this.ToggleAlerts}
                    off={'Disable Alerts'} 
                    on={'Enable Alerts'}
                    initial={this.ignoreAlerts}/>
              </div>

          </div>

          <div className="outer-header-column-two"> 

              <div className="header-column-two"> 
                <div className="sub-header-column-one">
                <button className="Thinner" onClick={this.Reset}>
                  Reset Run
                </button>
                </div>
                <div className="sub-header-column-two">
                    <h2>{"  Simulation Time  " }</h2>
                </div>
                <div className="sub-header-column-three">
                <button className="Thinner" onClick={this.Complete}>
                Complete Run
                </button>
                </div>
              </div>

              <div className="header-column-five"> 
                <div className="sub-header-column-one">
                    <button className="Thinner" onClick={this.lastEvent}>
                        Last Event
                    </button>
                </div>
                <div className="sub-header-column-two">
                    {/* <h2>{"  Simulation Time  " }</h2> */}
                    <CurrentTimeForm ref={c => this.TimeForm = c } 
                        time={this.time} onChange={this.TimeChanged}/>
                </div>
                <div className="sub-header-column-three">
                    <button className="Thinner" onClick={this.nextEvent}>
                        Next Event
                    </button>
                </div>
                
                {/* <button className="BigFont" onClick={this.Run1}>
                  Run 1
                </button>
                <button className="BigFont" onClick={this.Run100}>
                  Run 100
                </button>
                <button className="BigFont" onClick={this.Reset}>
                  Reset
                </button> */}
              </div>

              <div className="header-column-eight">

              <Slider rootStyle={sliderStyle} 
                domain={[this.time - 250, this.time + 250]} 
                values={[this.time]} step={1} mode={2}
                onChange={this.SliderChangedTime}
                onUpdate={this.SliderUpdatedTime} >
                <div style={railStyle} />
                    <Handles>
                        {({ handles, getHandleProps }) => (
                            <div className="handle">
                                {handles.map(handle => (
                                    <div className="handle" key={handle.id}>
                                    <Handle
                                        key={handle.id}
                                        handle={handle}
                                        getHandleProps={getHandleProps}
                                    />
                                    </div>
                                ))}
                            </div>
                        )}
                    </Handles>
                </Slider>

              </div>

          </div>

          <div className="outer-header-column-three"> 

              <div className="header-column-three"> 
                <h2>{"CPU" }</h2>
              </div>

              <div className="header-column-six">
                <HandleToggle className='BigFont'
                    handleClick = {this.ShowSettings}
                    on={'Settings'} 
                    off={'Settings'}/>
              </div>

              <div className="header-column-nine">
                {/* <HandleToggle className='BigFont'
                    handleClick = {this.ShowSettings}
                    on={`Available Memory: ${this.props.manager.FreeMemory}` } 
                    off={`Available Memory: ${this.props.manager.FreeMemory}` } /> */}
                <h2 className="BigFont">{"Available Memory: " + this.props.manager.FreeMemory }</h2>
              </div>

          </div>
        </div>
        );
    }
}

export default SimHeader;


// WEBPACK FOOTER //
// ./src/pages/simulator/Utils/SimHeader.js