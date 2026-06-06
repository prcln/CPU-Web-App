import React, { Component } from "react";
import "./Simulator.css";

import EventQueue from "./Queues/EventQueue";
import LargeJobQueue from "./Queues/LargeJobQueue";
import SmallJobQueue from "./Queues/SmallJobQueue";
import IOQueue from "./Queues/IOQueue";
import SimHeader from "./Utils/SimHeader";
import FinishedJobQueue from "./Queues/FinishedJobQueue";
import Settings from "./Utils/Settings";

import {SchedulerManager as MySystemManager} from "./implementation/SchedulerManager";

var fileReader;

var defualtSettings = {
  maxMemory: 512,
  quantum1: 100,
  quantum2: 300
};

let IGNORE_ALERTS = false;

var manager = new MySystemManager(defualtSettings, IGNORE_ALERTS);

fetch('inputFileC.txt')
.then(response => response.text())
.then(function(result) { 
  manager.ReadText(result); 
});

class Simulator extends Component {
  constructor() {
    super();
    this.state = {time: '', runfor: 0};



    this.HideAdvanced = false;
    this.ShowSettings = false;
    this.render = this.render.bind(this);
    this.getTime = this.getTime.bind(this);

    this.UpdateManager = this.SetSimulationTime.bind(this);
    this.Run = this.Run.bind(this);
    this.RunLastEvent = this.RunLastEvent.bind(this);
    this.RunNextEvent = this.RunNextEvent.bind(this);
    this.LoadFile = this.LoadFile.bind(this);
    this.ReloadManager = this.ReloadManager.bind(this);
    this.ToggleView = this.ToggleView.bind(this);
    this.ToggleSettings = this.ToggleSettings.bind(this);
  }

  ToggleView(value) {
    this.HideAdvanced = value;
  }

  ToggleSettings() {
    this.ShowSettings = true;
  }

  CloseSettings() {
    this.ShowSettings = false;
  }

  ReloadManager = (e) => {
    // var toggleAlerts = manager.ignorealerts;
    // var settings = manager.settings;
    // manager = new MySystemManager(settings, toggleAlerts);
    const content = fileReader.result;

    manager.ReadText(content);
    this.SetSimulationTime(0);
    this.Header.ChangeTime(manager.CurrentTime);
  };

  LoadFile(file) {
    fileReader = new FileReader();
    fileReader.onloadend = this.ReloadManager;
    fileReader.readAsText(file);
  }

  componentDidMount() {
    this._interval = setInterval(() => this.setState({time: this.getTime()}), 100);
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  getTime(){
    let t = new Date();
    return `${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`;
  }

  SetSimulationTime(time) {
    if (time>30000) {time=30000;}
    manager.Reset();
    manager.Run(time); 
  }

  Run(time) {
    manager.Run(time);
    this.Header.ChangeTime(manager.CurrentTime);
  }

  RunLastEvent() {
    var time = manager.lastArrivalTime;
    // console.log(time);
    this.SetSimulationTime(time);
    this.Header.ChangeTime(time);
  }

  RunNextEvent() {
    var nextEventTime = manager.EventListOBJ.length
      ? manager.EventListOBJ[0].arrivalTime
      : 30000;
    var cpuDoneTime =   manager.CPU.idle === false
      ? manager.CurrentTime + manager.CPU.job.NeededRunTime - manager.CPU.job.RunTime
      : 30001;
    var cpuTimeSlice =  manager.CPU.idle === false
      ? manager.CurrentTime + Number(manager.CPU.quantum)
      : 30001;
    var ioComplete =    manager.WaitQueueIO.WaitQueue.length > 0
      ? manager.CurrentTime + manager.WaitQueueIO.WaitQueue[0].NeededIOBurstTime - manager.WaitQueueIO.WaitQueue[0].IOBurstTime
      : 30001;
    // console.log(nextEventTime, cpuDoneTime, cpuTimeSlice, ioComplete)
    var time = Math.min(nextEventTime, cpuDoneTime, cpuTimeSlice, ioComplete);
    this.Run(time - manager.CurrentTime);
    // this.Header.ChangeTime(time);
  }
  
  render() {
    const SETTINGS_DIALOG = !this.ShowSettings ? (<div></div>) : (
    <Settings 
      close={this.CloseSettings.bind(this)} 
      manager={manager}
      LoadFile={this.LoadFile.bind(this)}
      />);

    const CPU_ELEMENT = manager.CPU.idle ? (
      <div className="column-divider column-A4">
        <div className="LargeTable">
          <h2 className="fixed"><center>CPU</center></h2>
          <div className="CPU">
            <div>
              <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
              <h2 className="fixed"><center>IDLE</center></h2>
            </div>
          </div>
        </div>
      </div>
  ) : (
    <div className="column-divider column-A4">
      <div className="LargeTable">
        <h2 className="fixed"><center>CPU</center></h2>
        <div className="CPU">
          <div>
            <br/><br/><br/><br/><br/><br/><br/><br/>
            <h2 className="fixed"><center>{"Process " + manager.CPU.job.JobNumber}</center></h2>
            <h2 className="fixed"><center>{"Memory: " + manager.CPU.job.Memory}</center></h2>
            <h2 className="fixed"><center>{"Runtime: " + manager.CPU.job.RemainingRunTime()}</center></h2>
            {manager.CPU.quantum < 30000 ? (<h2 className="fixed"><center>{"Quantum: " + manager.CPU.quantum}</center></h2>) : (<div/>)}
          </div>
        </div>
      </div>
    </div>
  );

  const PCB_ELEMENT = !this.HideAdvanced || true ? (
    <div className="column-divider column-B1">
        <div className="SmallTable">
          <h2 className="fixed"><center>Jobs Rejected by System</center></h2>
          <SmallJobQueue data={manager.RejectedJobsQueue}/>
        </div>
        <br/>
        <div className="SmallTable">
          <h2 className="fixed"><center>Job Scheduling Queue</center></h2>
          <SmallJobQueue data={manager.IncomingJobsQueue}/>
        </div>
      </div>
) : (
  <div className="column-divider column-B1">  
    <div className="LargeTable">
      <h2 className="fixed"><center>Job Scheduling Queue</center></h2>
      <LargeJobQueue data={manager.IncomingJobsQueue}/>
    </div>
  </div>
);

const QUEUES_1 = (

<div className="column-divider column-A2"> 
<div className="SmallTable">
  <h2 className="fixed"><center>Ready Queue Level 1</center></h2>
  <SmallJobQueue process={true} data={manager.ReadyQueueI}/>
</div>
<br/>
<div className="SmallTable">
  <h2 className="fixed"><center>I/O Burst Queue</center></h2>
  <IOQueue process={true} data={manager.WaitQueueIO.WaitQueue} Count={3} style={{height: "175px"}}/>
</div>
</div>
);

const QUEUES_2 = (

    <div className="column-divider column-A3"> 
      <div className="SmallTable">
        <h2 className="fixed"><center>Ready Queue Level 2</center></h2>
        <SmallJobQueue process={true} data={manager.ReadyQueueII}/>
      </div>
      <br/>
      <div className="SmallTable">
        <h2 className="fixed"><center>{("Semaphore 1 (Value: " + manager.S[0] + ")")}</center></h2>
        <SmallJobQueue process={true} data={manager.WaitQueueS[0]}/>
      </div>
    </div>
  );

  const Semaphores = !this.HideAdvanced ? (
  <div>
    <div className="container">
      <div className="column-divider column-A1">  
        <div className="LargeTable">
          <h2 className="fixed-small"><center>Incoming External Events</center></h2>
          <EventQueue data={manager.EventListOBJ}/>
        </div>              
      </div> 

      {QUEUES_1}

      {QUEUES_2}

      {CPU_ELEMENT}
    </div>
    <div className="container">
      {PCB_ELEMENT}

      <div className="column-divider column-B2">
        <div className="SmallTable">
          <h2 className="fixed"><center>{("Semaphore 2 (Value: " + manager.S[1] + ")")}</center></h2>
          <SmallJobQueue process={true} data={manager.WaitQueueS[1]}/>
        </div>
        <br/>
        <div className="SmallTable">
          <h2 className="fixed"><center>{("Semaphore 4 (Value: " + manager.S[3] + ")")}</center></h2>
          <SmallJobQueue process={true} data={manager.WaitQueueS[3]}/>
        </div>
      </div>

      <div className="column-divider column-B3"> 
        <div className="SmallTable">
          <h2 className="fixed"><center>{("Semaphore 3 (Value: " + manager.S[2] + ")")}</center></h2>
          <SmallJobQueue process={true} data={manager.WaitQueueS[2]}/>
        </div>
        <br/>
        <div className="SmallTable">
          <h2 className="fixed"><center>{("Semaphore 5 (Value: " + manager.S[4] + ")")}</center></h2>
          <SmallJobQueue process={true} data={manager.WaitQueueS[4]}/>
        </div>
      </div>

      <div className="column-divider column-B4">
        <div className="LargeTable">
          <h2 className="fixed"><center>Finished Process List</center></h2>
          <FinishedJobQueue process={true} data={manager.FinishedQueue}/>
        </div>
      </div>
    </div> 
  </div>
    ) : (
  <div>    
    <div className="container">
      <div className="column-divider column-A1">  
        <div className="LargeTable">
          <h2 className="fixed-small"><center>Incoming External Events</center></h2>
          <EventQueue data={manager.EventListOBJ}/>
        </div>              
      </div> 

      <div className="column-divider column-A2">          
        <div className="LargeTable">
          <h2 className="fixed"><center>Ready Queue Level 1</center></h2>
          <LargeJobQueue process={true} data={manager.ReadyQueueI}/>
        </div>
      </div>

      <div className="column-divider column-A3"> 
        <div className="LargeTable">
          <h2 className="fixed"><center>Ready Queue Level 2</center></h2>
          <LargeJobQueue process={true} data={manager.ReadyQueueII}/>
        </div>
      </div>

      {CPU_ELEMENT}
    </div>
    <div className="container">
      {PCB_ELEMENT}

      <div className="column-divider column-B2">
        <div className="LargeTable">
          <h2 className="fixed"><center>I/O Burst Queue</center></h2>
          <IOQueue process={true} data={manager.WaitQueueIO.WaitQueue} Count={10} style={{height: "420px"}}/>
        </div>
      </div>

      <div className="column-divider column-B3-B4">
        <div className="SuperLargeTable">
          <h2 className="fixed"><center>Finished Process List</center></h2>
          <FinishedJobQueue data={manager.FinishedQueue}/>
        </div>
      </div>
    </div>
  </div>
  );
    const DEADLOCK_WARNING = manager.DeadlockInfo && manager.DeadlockInfo.deadlocked ? (() => {
      const cycle = manager.DeadlockInfo.cycle;
      const deadlockedJobs = cycle.filter(n => n.type === 'job').map(n => n.id);
      const deadlockedSems = cycle.filter(n => n.type === 'sem').map(n => n.id);

      // Build per-job detail: what each job holds and what it's waiting for
      const jobDetails = deadlockedJobs.map(jobId => {
        const holdsIdx = cycle.findIndex(n => n.type === 'job' && n.id === jobId);
        const holdsSem = holdsIdx > 0 ? cycle[holdsIdx - 1].id : null;  // sem before job in cycle
        const waitsSem = cycle[holdsIdx + 1] ? cycle[holdsIdx + 1].id : null; // sem after job
        return { jobId, holdsSem, waitsSem };
      });

      // Build visual cycle chain string: Sem1 → Job1 → Sem2 → Job2 → (loop)
      const chainNodes = cycle.map((n, i) => (
        <span key={i}>
          {i > 0 && <span className="dl-arrow"> ➜ </span>}
          {n.type === 'job'
            ? <span className="dl-chip dl-chip-job">Job {n.id}</span>
            : <span className="dl-chip dl-chip-sem">Sem {n.id + 1} (={manager.S[n.id]})</span>
          }
        </span>
      ));

      return (
        <div className="deadlock-warning-banner">
          {/* Header row */}
          <div className="dl-header">
            <span className="deadlock-warning-icon">🔴</span>
            <div>
              <div className="dl-title">Phát hiện Bế Tắc — Deadlock Detected</div>
              <div className="dl-subtitle">
                Detected at simulation time <strong>T = {manager.CurrentTime}</strong>
                {" · "}{deadlockedJobs.length} processes involved
                {" · "}{deadlockedSems.length} semaphores locked
              </div>
            </div>
          </div>

          {/* Cycle chain */}
          <div className="dl-section">
            <div className="dl-section-label">🔄 Circular Wait Chain</div>
            <div className="dl-chain">
              {chainNodes}
              <span className="dl-arrow"> ➜ </span>
              <span className="dl-chip dl-chip-loop">↩ loop</span>
            </div>
          </div>

          {/* Per-job breakdown */}
          <div className="dl-section">
            <div className="dl-section-label">📋 Process Detail</div>
            <div className="dl-jobs">
              {jobDetails.map(({ jobId, holdsSem, waitsSem }) => (
                <div key={jobId} className="dl-job-card">
                  <div className="dl-job-title">Job {jobId}</div>
                  <div className="dl-job-row">
                    <span className="dl-label">Holds:</span>
                    {holdsSem !== null
                      ? <span className="dl-chip dl-chip-sem sm">Sem {holdsSem + 1} (={manager.S[holdsSem]})</span>
                      : <span className="dl-none">—</span>}
                  </div>
                  <div className="dl-job-row">
                    <span className="dl-label">Waiting for:</span>
                    {waitsSem !== null
                      ? <span className="dl-chip dl-chip-sem sm">Sem {waitsSem + 1} (={manager.S[waitsSem]})</span>
                      : <span className="dl-none">—</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    })() : null;


    return (
      <div> 
        <div>
          <SimHeader ref = {c => this.Header = c}
          UpdateManger={this.SetSimulationTime}
          Run={this.Run} Time={manager.CurrentTime}
          lastEvent={this.RunLastEvent}
          nextEvent={this.RunNextEvent}
          Reset={this.SetSimulationTime}
          manager={manager}
          ignorealerts={IGNORE_ALERTS}
          ToggleAlerts={manager.ToggleAlerts}
          ViewToggle={this.ToggleView}
          SettingsToggle={this.ToggleSettings}
          initialToggleAlerts={manager.ignorealerts}
        />

          {DEADLOCK_WARNING}

          {Semaphores}

          {/* <span>
        <input type="file"
        name="myFile"
        onChange={e => this.LoadFile(e.target.files[0])}
        accept='.txt' />
      </span> */}

        </div>
        {SETTINGS_DIALOG}
      </div>
    );
  }
}
 
export default Simulator;


// WEBPACK FOOTER //
// ./src/pages/simulator/Simulator.js