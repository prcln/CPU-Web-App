import React, { Component } from "react";
import "./Simulator.css";

import EventQueue from "./Queues/EventQueue";
import LargeJobQueue from "./Queues/LargeJobQueue";
import SmallJobQueue from "./Queues/SmallJobQueue";
import IOQueue from "./Queues/IOQueue";
import SimHeader from "./Utils/SimHeader";
import FinishedJobQueue from "./Queues/FinishedJobQueue";
import Settings from "./Utils/Settings";

import { t } from "../../language/i18n";
import { SchedulerManager as MySystemManager } from "./implementation/SchedulerManager";

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
  .then(function (result) {
    manager.ReadText(result);
  });

class Simulator extends Component {
  constructor() {
    super();
    this.state = { time: '', runfor: 0 };



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
    this.toggleLog = this.toggleLog.bind(this);

    this.lastAlertCount = 0;
  }

  toggleLog() {
    this.showLog = !this.showLog;
    this.forceUpdate();
  }

  componentDidUpdate() {
    if (manager.alerts && manager.alerts.length < this.lastAlertCount) {
      this.lastAlertCount = manager.alerts.length;
      this.setState({ toasts: [] });
    }
    else if (manager.alerts && manager.alerts.length > this.lastAlertCount) {
      const newAlerts = manager.alerts.slice(this.lastAlertCount);
      this.lastAlertCount = manager.alerts.length;

      if (!manager.ignorealerts) {
        const toastsToAdd = newAlerts.map(a => ({ ...a, visible: true }));
        this.setState(prev => ({
          toasts: [...(prev.toasts || []), ...toastsToAdd]
        }));

        toastsToAdd.forEach(t => {
          setTimeout(() => {
            this.setState(prev => ({ toasts: (prev.toasts || []).filter(x => x.id !== t.id) }));
          }, 4000);
        });
      }
    }
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
    this.interval = setInterval(() => this.setState({ time: this.getTime() }), 100);

    this.handleMouseMove = (e) => {
      const target = e.target.closest('.has-smart-tooltip');
      const tooltip = document.getElementById('global-smart-tooltip');
      if (target && tooltip) {
        let text = target.getAttribute('data-tooltip');
        // fallback for CPU element which used a child div before
        if (!text && target.classList.contains('CPU')) {
          text = manager.CPU.job ? (manager.CPU.job.stateReason || "Tiến trình đang được thực thi trên CPU.") : "";
        }

        if (text) {
          tooltip.textContent = text;
          tooltip.style.visibility = 'visible';
          tooltip.style.opacity = '1';
          tooltip.style.left = e.clientX + 'px';
          tooltip.style.top = (e.clientY - 10) + 'px';
          tooltip.style.transform = 'translate(-50%, -100%)';
        }
      } else if (tooltip) {
        tooltip.style.visibility = 'hidden';
        tooltip.style.opacity = '0';
      }
    };
    document.addEventListener('mousemove', this.handleMouseMove);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    document.removeEventListener('mousemove', this.handleMouseMove);
  }

  getTime() {
    let t = new Date();
    return `${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`;
  }

  SetSimulationTime(time) {
    if (time > 30000) { time = 30000; }
    manager.Reset();
    manager.Run(time);
    this.lastAlertCount = manager.alerts.length;
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
    var cpuDoneTime = manager.CPU.idle === false
      ? manager.CurrentTime + manager.CPU.job.NeededRunTime - manager.CPU.job.RunTime
      : 30001;
    var cpuTimeSlice = manager.CPU.idle === false
      ? manager.CurrentTime + Number(manager.CPU.quantum)
      : 30001;
    var ioComplete = manager.WaitQueueIO.WaitQueue.length > 0
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
          <h2 className="fixed"><center>{t("panel_cpu")}</center></h2>
          <div className="CPU">
            <div>
              <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
              <h2 className="fixed"><center>{t("cpu_idle")}</center></h2>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="column-divider column-A4">
        <div className="LargeTable">
          <h2 className="fixed"><center>{t("panel_cpu")}</center></h2>
          <div className="CPU has-smart-tooltip">
            <div>
              <br /><br /><br /><br /><br /><br /><br /><br />
              <h2 className="fixed"><center>{t("cpu_process", manager.CPU.job.JobNumber)}</center></h2>
              <h2 className="fixed"><center>{t("cpu_memory", manager.CPU.job.Memory)}</center></h2>
              <h2 className="fixed"><center>{t("cpu_runtime", manager.CPU.job.RemainingRunTime())}</center></h2>
              {manager.CPU.quantum < 30000 ? (<h2 className="fixed"><center>{t("cpu_quantum", manager.CPU.quantum)}</center></h2>) : (<div />)}
            </div>
          </div>
        </div>
      </div>
    );

    const PCB_ELEMENT = !this.HideAdvanced || true ? (
      <div className="column-divider column-B1">
        <div className="SmallTable">
          <h2 className="fixed"><center>{t("q_rejected")}</center></h2>
          <SmallJobQueue data={manager.RejectedJobsQueue} />
        </div>
        <br />
        <div className="SmallTable">
          <h2 className="fixed"><center>{t("q_incoming")}</center></h2>
          <SmallJobQueue data={manager.IncomingJobsQueue} />
        </div>
      </div>
    ) : (
      <div className="column-divider column-B1">
        <div className="LargeTable">
          <h2 className="fixed"><center>{t("q_incoming")}</center></h2>
          <LargeJobQueue data={manager.IncomingJobsQueue} />
        </div>
      </div>
    );

    const QUEUES_1 = (

      <div className="column-divider column-A2">
        <div className="SmallTable">
          <h2 className="fixed"><center>{t("q_ready1")}</center></h2>
          <SmallJobQueue process={true} data={manager.ReadyQueueI} />
        </div>
        <br />
        <div className="SmallTable">
          <h2 className="fixed"><center>{t("q_io")}</center></h2>
          <IOQueue process={true} data={manager.WaitQueueIO.WaitQueue} Count={3} style={{ height: "175px" }} />
        </div>
      </div>
    );

    const QUEUES_2 = (

      <div className="column-divider column-A3">
        <div className="SmallTable">
          <h2 className="fixed"><center>{t("q_ready2")}</center></h2>
          <SmallJobQueue process={true} data={manager.ReadyQueueII} />
        </div>
        <br />
        <div className="SmallTable">
          <h2 className="fixed"><center>{t("q_sem", 1, manager.S[0])}</center></h2>
          <SmallJobQueue process={true} data={manager.WaitQueueS[0]} />
        </div>
      </div>
    );

    const Semaphores = !this.HideAdvanced ? (
      <div>
        <div className="container">
          <div className="column-divider column-A1">
            <div className="LargeTable">
              <h2 className="fixed-small"><center>Incoming External Events</center></h2>
              <EventQueue data={manager.EventListOBJ} />
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
              <h2 className="fixed"><center>{t("q_sem", 2, manager.S[1])}</center></h2>
              <SmallJobQueue process={true} data={manager.WaitQueueS[1]} />
            </div>
            <br />
            <div className="SmallTable">
              <h2 className="fixed"><center>{t("q_sem", 4, manager.S[3])}</center></h2>
              <SmallJobQueue process={true} data={manager.WaitQueueS[3]} />
            </div>
          </div>

          <div className="column-divider column-B3">
            <div className="SmallTable">
              <h2 className="fixed"><center>{t("q_sem", 3, manager.S[2])}</center></h2>
              <SmallJobQueue process={true} data={manager.WaitQueueS[2]} />
            </div>
            <br />
            <div className="SmallTable">
              <h2 className="fixed"><center>{t("q_sem", 5, manager.S[4])}</center></h2>
              <SmallJobQueue process={true} data={manager.WaitQueueS[4]} />
            </div>
          </div>

          <div className="column-divider column-B4">
            <div className="LargeTable">
              <h2 className="fixed"><center>{t("q_finished")}</center></h2>
              <FinishedJobQueue process={true} data={manager.FinishedQueue} />
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
              <EventQueue data={manager.EventListOBJ} />
            </div>
          </div>

          <div className="column-divider column-A2">
            <div className="LargeTable">
              <h2 className="fixed"><center>{t("q_ready1")}</center></h2>
              <LargeJobQueue process={true} data={manager.ReadyQueueI} />
            </div>
          </div>

          <div className="column-divider column-A3">
            <div className="LargeTable">
              <h2 className="fixed"><center>{t("q_ready2")}</center></h2>
              <LargeJobQueue process={true} data={manager.ReadyQueueII} />
            </div>
          </div>

          {CPU_ELEMENT}
        </div>
        <div className="container">
          {PCB_ELEMENT}

          <div className="column-divider column-B2">
            <div className="LargeTable">
              <h2 className="fixed"><center>{t("q_io")}</center></h2>
              <IOQueue process={true} data={manager.WaitQueueIO.WaitQueue} Count={10} style={{ height: "420px" }} />
            </div>
          </div>

          <div className="column-divider column-B3-B4">
            <div className="SuperLargeTable">
              <h2 className="fixed-big"><center>{t("q_finished")}</center></h2>
              <FinishedJobQueue data={manager.FinishedQueue} />
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
              <div className="dl-title">{t("dl_title")}</div>
              <div className="dl-subtitle">
                {t("dl_subtitle_time")} <strong>T = {manager.DeadlockInfo.time}</strong>
                {" · "}{deadlockedJobs.length} {t("dl_subtitle_jobs")}
                {" · "}{deadlockedSems.length} {t("dl_subtitle_sems")}
              </div>
            </div>
          </div>

          {/* Cycle chain */}
          <div className="dl-section">
            <div className="dl-section-label">{t("dl_chain_label")}</div>
            <div className="dl-chain">
              {chainNodes}
              <span className="dl-arrow"> ➜ </span>
              <span className="dl-chip dl-chip-loop">{t("dl_loop")}</span>
            </div>
          </div>

          {/* Per-job breakdown */}
          <div className="dl-section">
            <div className="dl-section-label">{t("dl_detail_label")}</div>
            <div className="dl-jobs">
              {jobDetails.map(({ jobId, holdsSem, waitsSem }) => (
                <div key={jobId} className="dl-job-card">
                  <div className="dl-job-title">Job {jobId}</div>
                  <div className="dl-job-row">
                    <span className="dl-label">{t("dl_holds")}</span>
                    {holdsSem !== null
                      ? <span className="dl-chip dl-chip-sem sm">Sem {holdsSem + 1} (={manager.S[holdsSem]})</span>
                      : <span className="dl-none">—</span>}
                  </div>
                  <div className="dl-job-row">
                    <span className="dl-label">{t("dl_waiting")}</span>
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
        <div id="global-smart-tooltip"></div>
        <div>
          <SimHeader ref={c => this.Header = c}
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
            LogToggle={this.toggleLog}
            initialToggleAlerts={manager.ignorealerts}
          />

          {/* Toast Container */}
          <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {this.state.toasts && this.state.toasts.map(t => (
              <div key={t.id} style={{ background: '#dc3545', color: 'white', padding: '15px 20px', borderRadius: '5px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', width: '300px', fontSize: '15px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>⚠️ Alert [Time: {t.time}]</div>
                <div>{t.message}</div>
              </div>
            ))}
          </div>

          {/* Expanded Log Modal */}
          {this.showLog && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 10000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div className="alerts-modal" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-main)', padding: '20px', width: '90%', maxWidth: '800px', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', maxHeight: '80vh', border: '1px solid var(--border-muted)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--border-muted)', paddingBottom: '12px', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0, fontSize: '22px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
                    {t("alert_log")}
                  </h3>
                  <button onClick={this.toggleLog} style={{ background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--text-muted)' }}>✖</button>
                </div>
                {(!manager.alerts || manager.alerts.length === 0) ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>{t("alert_no_alerts")}</div>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: '24px', overflowY: 'auto', flex: 1, color: 'var(--text-main)' }}>
                    {manager.alerts.map(a => (
                      <li key={a.id} style={{ marginBottom: '10px', fontSize: '15px' }}>
                        <strong style={{ color: '#ef4444' }}>{t("alert_time", a.time)}</strong> {a.message}
                      </li>
                    ))}
                  </ul>
                )}
                {manager.alerts && manager.alerts.length > 0 && (
                  <div style={{ borderTop: '1px solid var(--border-muted)', paddingTop: '12px', marginTop: '12px', textAlign: 'right' }}>
                    <button onClick={() => { manager.alerts = []; this.forceUpdate(); }} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}>
                      {t("alert_clear")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

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