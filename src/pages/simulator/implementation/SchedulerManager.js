import Job from "./job";
import { t } from "../../../language/i18n";
import CPU from "./cpu";
import WaitQueueIO from "./WaitQueueIO";
import Event from "./Event";

export class SchedulerManager {
    constructor(settings, ignorealerts) {
        this.settings = settings;

        this.Memory = settings.maxMemory;
        this.quantum1 = settings.quantum1;
        this.quantum2 = settings.quantum2;

        this.scenarioName = 'Scenario C';

        this.ignorealerts = ignorealerts;
        this.CurrentTime = 0;
        this.lastArrivalTime = 0;
        this.currentArrivalTime = 0;
        this.FreeMemory = this.Memory;
        this.EventListOBJ = [];
        this.PermEventListOBJ = [];
        this.IncomingJobsQueue = [];
        this.RejectedJobsQueue = [];
        this.ReadyQueueI = [];
        this.ReadyQueueII = [];
        this.WaitQueueIO = new WaitQueueIO();
        this.CPU = new CPU();
        this.FinishedQueue = [];
        this.S = [1, 1, 1, 1, 1];
        this.WaitQueueS = [[], [], [], [], []];

        // Deadlock tracking fields
        this.SemaphoreOwner = [null, null, null, null, null];
        this.DeadlockInfo = { deadlocked: false };

        this.alerts = [];

        this.Run = this.Run.bind(this);
        this.ReadText = this.ReadText.bind(this);
        this.ToggleAlerts = this.ToggleAlerts.bind(this);
    }

    Reset() {
        this.Memory = this.settings.maxMemory;
        this.quantum1 = this.settings.quantum1;
        this.quantum2 = this.settings.quantum2;

        this.CurrentTime = 0;
        this.lastArrivalTime = 0;
        this.currentArrivalTime = 0;
        this.FreeMemory = this.Memory;
        this.IncomingJobsQueue = [];
        this.RejectedJobsQueue = [];
        this.ReadyQueueI = [];
        this.ReadyQueueII = [];
        this.WaitQueueIO = new WaitQueueIO();
        this.CPU = new CPU();
        this.FinishedQueue = [];
        this.S = [1, 1, 1, 1, 1];
        this.WaitQueueS = [[], [], [], [], []];

        // Reset deadlock tracking fields
        this.SemaphoreOwner = [null, null, null, null, null];
        this.DeadlockInfo = { deadlocked: false };

        this.alerts = [];

        this.EventListOBJ = [];
        this.PermEventListOBJ.forEach(element => {
            this.EventListOBJ.push(element)
        });
    }

    ToggleAlerts(value) {
        // console.log(value);
        this.ignorealerts = value;
    }

    triggerAlert(msg) {
        if (!this.ignorealerts) {
            this.alertIdCounter = (this.alertIdCounter || 0) + 1;
            this.alerts.push({ id: this.alertIdCounter, message: msg, time: this.CurrentTime });
        }
    }

    ReadText(text) {
        this.Reset()
        var nEventListOBJ = [];
        var nEventListOBJCopy = [];
        var lines = text.split('\n');
        for (var line = 0; line < lines.length; line++) {
            // Skip blank or whitespace-only lines
            if (!lines[line].trim()) continue;
            var newEvent = new Event(lines[line]);
            if (newEvent.type !== 'X') {
                nEventListOBJCopy.push(newEvent);
                nEventListOBJ.push(newEvent);
            }
        }

        nEventListOBJ.sort(function (a, b) {
            if (a.arrivalTime > b.arrivalTime) {
                return 1;
            }
            if (a.arrivalTime < b.arrivalTime) {
                return -1;
            }
            return 0;
        });

        this.EventListOBJ = nEventListOBJ;
        this.PermEventListOBJ = nEventListOBJCopy;
        // alert('New Scenario Loaded!');
    }

    EventList() {
        return this.EventListOBJ;
    }

    CheckEventQueue() {
        if (this.EventListOBJ.length > 0 && this.EventListOBJ[0].arrivalTime === this.CurrentTime) {
            var newEvent = this.EventListOBJ.shift();
            this.lastArrivalTime = this.currentArrivalTime;
            this.currentArrivalTime = newEvent.arrivalTime;
            // console.log(newEvent);

            if (newEvent.type === 'A') {
                if (newEvent.memory > this.Memory) {
                    const rejectedJob = new Job(
                        newEvent.number,
                        newEvent.arrivalTime,
                        newEvent.runtime,
                        newEvent.memory);
                    rejectedJob.stateReason = t("tt_rejected", newEvent.number, newEvent.memory, this.Memory);
                    this.RejectedJobsQueue.push(rejectedJob);
                    console.log("Rejected Job " + newEvent.number +
                        " requiring " + newEvent.memory + " memory");
                    this.triggerAlert(t("alert_rejected", newEvent.number, newEvent.memory, this.Memory));
                    return true;
                }
                this.IncomingJobsQueue.push(new Job(
                    newEvent.number,
                    newEvent.arrivalTime,
                    newEvent.runtime,
                    newEvent.memory));
            }
            else if (newEvent.type === 'I') {
                if (this.CPU.idle) {
                    console.log("I/O Wait Event but CPU was Idle at time: " + this.CurrentTime);
                    this.triggerAlert(t("alert_idle_cpu"));
                }
                var IOJob = this.CPU.job;
                IOJob.stateReason = t("tt_io_wait", IOJob.JobNumber, newEvent.burstTime);
                this.WaitQueueIO.AddJob(IOJob, newEvent.burstTime);
                this.CPU.idle = true;
                this.RunScheduling();
            }
            else if (newEvent.type === 'S') {
                if (newEvent.semaphore < 0 || newEvent.semaphore > 4) {
                    console.log("Semaphore " + newEvent.semaphore + " does not exist.");
                    this.triggerAlert(t("alert_no_semaphore", newEvent.semaphore));
                }
                else {
                    if (this.WaitQueueS[newEvent.semaphore].length > 0) {
                        var nextJob = this.WaitQueueS[newEvent.semaphore].shift();
                        nextJob.stateReason = t("tt_sem_done", nextJob.JobNumber, newEvent.semaphore);
                        this.ReadyQueueI.push(nextJob);
                        this.SemaphoreOwner[newEvent.semaphore] = nextJob.JobNumber;
                    } else {
                        this.S[newEvent.semaphore]++;
                        this.SemaphoreOwner[newEvent.semaphore] = null;
                    }
                }
            }
            else if (newEvent.type === 'W') {
                if (newEvent.semaphore < 0 || newEvent.semaphore > 4) {
                    console.log("Semaphore " + newEvent.semaphore + " does not exist.");
                    this.triggerAlert(t("alert_no_semaphore", newEvent.semaphore));
                }
                else {
                    // Only process W event if a job is actually running
                    if (this.CPU.idle || !this.CPU.job) {
                        console.log("W event at time " + this.CurrentTime + " but CPU is idle — skipping.");
                    } else if (this.S[newEvent.semaphore] > 0) {
                        this.S[newEvent.semaphore]--;
                        this.SemaphoreOwner[newEvent.semaphore] = this.CPU.job.JobNumber;
                    }
                    else {
                        // Block the currently running job
                        this.CPU.job.stateReason = t("tt_sem_wait", this.CPU.job.JobNumber, newEvent.semaphore);
                        this.WaitQueueS[newEvent.semaphore].push(this.CPU.job);
                        this.CPU.idle = true;
                        this.RunScheduling();
                    }
                }
            }

            return true;
        }
        else if (this.CurrentTime > this.currentArrivalTime) {
            this.lastArrivalTime = this.currentArrivalTime;
        }
        return false;
    }

    RunScheduling() {
        // Process Incoming Jobs
        while (this.IncomingJobsQueue.length > 0 && this.IncomingJobsQueue[0].Memory <= this.FreeMemory) {
            var job = this.IncomingJobsQueue.shift();
            this.FreeMemory = this.FreeMemory - job.Memory;
            job.stateReason = t("tt_loaded", job.JobNumber);
            this.ReadyQueueI.push(job);
        }
        if (this.CPU.idle) {
            if (this.ReadyQueueI.length > 0) {
                var jobI = this.ReadyQueueI.shift();
                jobI.stateReason = t("tt_run_q1", jobI.JobNumber, this.quantum1);
                this.CPU.AddJob(jobI, this.quantum1);
            }
            else if (this.ReadyQueueII.length > 0) {
                var jobII = this.ReadyQueueII.shift();
                jobII.stateReason = t("tt_run_q2", jobII.JobNumber, this.quantum2);
                this.CPU.AddJob(jobII, this.quantum2);
            }
        }
    }

    Run(ticks) {
        for (var i = 0; i < ticks; i++) {
            // Incriment Current Time
            this.CurrentTime++;

            // Handle All Events
            while (this.CheckEventQueue()) { }
            // Run CPU and IO
            if (this.CPU.Run(this.CurrentTime)) {
                if (this.CPU.job.Done) {
                    this.CPU.job.stateReason = t("tt_finished", this.CPU.job.JobNumber);
                    this.FinishedQueue.push(this.CPU.job);
                    this.FreeMemory += this.CPU.job.Memory;

                    // Release all owned semaphores when job terminates
                    for (let s = 0; s < 5; s++) {
                        if (this.SemaphoreOwner[s] === this.CPU.job.JobNumber) {
                            this.SemaphoreOwner[s] = null;
                        }
                    }
                }
                else {
                    this.CPU.job.stateReason = t("tt_demoted", this.CPU.job.JobNumber);
                    this.ReadyQueueII.push(this.CPU.job);
                }
                this.lastArrivalTime = this.currentArrivalTime;
                this.currentArrivalTime = this.CurrentTime;
            }
            var jobs = this.WaitQueueIO.RunJobs();
            if (jobs.length > 0) {
                this.lastArrivalTime = this.currentArrivalTime;
                this.currentArrivalTime = this.CurrentTime;
            }
            jobs.forEach(job => {
                job.stateReason = t("tt_io_done", job.JobNumber);
                this.ReadyQueueI.push(job);
            });
            // Run Scheduling
            this.RunScheduling();

            // Check for deadlocks at each simulation cycle
            var newDeadlockInfo = this.DetectDeadlock();
            if (newDeadlockInfo.deadlocked && !this.DeadlockInfo.deadlocked) {
                var jobList = newDeadlockInfo.cycle
                    .filter(node => node.type === 'job')
                    .map(node => "Job " + node.id)
                    .join(", ");
                this.triggerAlert(t("alert_deadlock", jobList));
                newDeadlockInfo.time = this.CurrentTime;
            } else if (newDeadlockInfo.deadlocked && this.DeadlockInfo.deadlocked) {
                newDeadlockInfo.time = this.DeadlockInfo.time;
            }
            this.DeadlockInfo = newDeadlockInfo;
        }
        // if (this.CurrentTime === 30000) {
        //     alert("Simulation complete.");
        // }
    }

    DetectDeadlock() {
        let visited = new Set();
        let cycleNodes = [];

        for (let i = 0; i < 5; i++) {
            let owner = this.SemaphoreOwner[i];
            if (owner === null) continue;

            let path = [];
            let current = { type: 'sem', id: i };
            let pathSet = new Set();
            let hasCycle = false;

            while (current !== null) {
                let key = `${current.type}_${current.id}`;
                if (pathSet.has(key)) {
                    hasCycle = true;
                    let cycleStartIdx = path.findIndex(x => `${x.type}_${x.id}` === key);
                    cycleNodes = path.slice(cycleStartIdx);
                    break;
                }
                if (visited.has(key)) {
                    break;
                }

                visited.add(key);
                pathSet.add(key);
                path.push(current);

                if (current.type === 'sem') {
                    let nextOwner = this.SemaphoreOwner[current.id];
                    if (nextOwner !== null && nextOwner !== undefined) {
                        current = { type: 'job', id: nextOwner };
                    } else {
                        current = null;
                    }
                } else { // type === 'job'
                    let waitingSem = -1;
                    const jobId = current.id;
                    for (let s = 0; s < 5; s++) {
                        // Guard against null entries that may have been pushed when CPU was idle
                        if (this.WaitQueueS[s].some(job => job && job.JobNumber === jobId)) {
                            waitingSem = s;
                            break;
                        }
                    }
                    if (waitingSem !== -1) {
                        current = { type: 'sem', id: waitingSem };
                    } else {
                        current = null;
                    }
                }
            }

            if (hasCycle) {
                return {
                    deadlocked: true,
                    cycle: cycleNodes
                };
            }
        }

        return { deadlocked: false };
    }
}

export default SchedulerManager;


// WEBPACK FOOTER //
// ./src/pages/simulator/implementation/SchedulerManager.js