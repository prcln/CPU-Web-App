import Job from "./job";
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
        this.ReadyQueueI= [];
        this.ReadyQueueII= [];
        this.WaitQueueIO = new WaitQueueIO();
        this.CPU = new CPU();
        this.FinishedQueue= [];
        this.S=[1,1,1,1,1];
        this.WaitQueueS = [[],[],[],[],[]];
        
        // Deadlock tracking fields
        this.SemaphoreOwner = [null, null, null, null, null];
        this.DeadlockInfo = { deadlocked: false };

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
        this.ReadyQueueI= [];
        this.ReadyQueueII= [];
        this.WaitQueueIO = new WaitQueueIO();
        this.CPU = new CPU();
        this.FinishedQueue= [];
        this.S=[1,1,1,1,1];
        this.WaitQueueS = [[],[],[],[],[]];
        
        // Reset deadlock tracking fields
        this.SemaphoreOwner = [null, null, null, null, null];
        this.DeadlockInfo = { deadlocked: false };

        this.EventListOBJ = [];
        this.PermEventListOBJ.forEach(element => {
            this.EventListOBJ.push(element)
        });
    }

    ToggleAlerts(value) {
        // console.log(value);
        this.ignorealerts = value;
    }

    ReadText(text) {
        this.Reset()
        var nEventListOBJ = [];
        var nEventListOBJCopy = [];
        var lines = text.split('\n');
        for(var line = 0; line < lines.length; line++) {
            // Skip blank or whitespace-only lines
            if (!lines[line].trim()) continue;
            var newEvent = new Event(lines[line]);
            if (newEvent.type !== 'X') {
                nEventListOBJCopy.push(newEvent);
                nEventListOBJ.push(newEvent);  
            }
        }

        nEventListOBJ.sort(function(a,b){
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
        if(this.EventListOBJ.length > 0 && this.EventListOBJ[0].arrivalTime === this.CurrentTime) 
        {
            var newEvent = this.EventListOBJ.shift();
            this.lastArrivalTime = this.currentArrivalTime;
            this.currentArrivalTime = newEvent.arrivalTime;
            // console.log(newEvent);

            if (newEvent.type === 'A') {
                if(newEvent.memory > this.Memory) {
                    this.RejectedJobsQueue.push(new Job(
                        newEvent.number, 
                        newEvent.arrivalTime, 
                        newEvent.runtime, 
                        newEvent.memory));
                    console.log("Rejected Job " + newEvent.number + 
                        " requiring " + newEvent.memory + " memory");
                    if(!this.ignorealerts) {
                        alert(`The system rejected job ${newEvent.number} for requiring ${newEvent.memory} units of memory. The maximum memory is ${this.Memory} units.`);
                    }
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
                    if(!this.ignorealerts) {
                        alert("An event occurred that effects the current running process but the CPU was idle.");
                    }
                }
                var IOJob = this.CPU.job;
                this.WaitQueueIO.AddJob(IOJob, newEvent.burstTime);
                this.CPU.idle = true;
                this.RunScheduling();
            }
            else if (newEvent.type === 'S') {
                if (newEvent.semaphore < 0 || newEvent.semaphore > 4) {
                    console.log("Semaphore " + newEvent.semaphore + " does not exist.");
                    if(!this.ignorealerts) {
                        alert("Semaphore " + newEvent.semaphore + " does not exist.");
                    }
                }
                else  {
                    if(this.WaitQueueS[newEvent.semaphore].length > 0) {
                        var nextJob = this.WaitQueueS[newEvent.semaphore].shift();
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
                    if(!this.ignorealerts) {
                        alert("Semaphore " + newEvent.semaphore + " does not exist.");
                    }
                }
                else  {
                    // Only process W event if a job is actually running
                    if (this.CPU.idle || !this.CPU.job) {
                        console.log("W event at time " + this.CurrentTime + " but CPU is idle — skipping.");
                    } else if (this.S[newEvent.semaphore] > 0) {
                        this.S[newEvent.semaphore]--;
                        this.SemaphoreOwner[newEvent.semaphore] = this.CPU.job.JobNumber;
                    }
                    else {
                        // Block the currently running job
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
            this.ReadyQueueI.push(job);
        }
        if (this.CPU.idle) {
            if (this.ReadyQueueI.length > 0) {
                this.CPU.AddJob(this.ReadyQueueI.shift(), this.quantum1); 
            }
            else if (this.ReadyQueueII.length > 0) {
                this.CPU.AddJob(this.ReadyQueueII.shift(), this.quantum2);
            }
        }
    }

    Run(ticks) {
        for (var i = 0; i < ticks; i++) {
            // Incriment Current Time
            this.CurrentTime++;

            // Handle All Events
            while( this.CheckEventQueue() ){}
            // Run CPU and IO
            if(this.CPU.Run(this.CurrentTime)) {
                if(this.CPU.job.Done) {
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
                this.ReadyQueueI.push(job);
            });
            // Run Scheduling
            this.RunScheduling();
            
            // Check for deadlocks at each simulation cycle
            var newDeadlockInfo = this.DetectDeadlock();
            if (newDeadlockInfo.deadlocked && !this.DeadlockInfo.deadlocked) {
                if (!this.ignorealerts) {
                    var jobList = newDeadlockInfo.cycle
                        .filter(node => node.type === 'job')
                        .map(node => "Job " + node.id)
                        .join(", ");
                    alert("Cảnh báo: Phát hiện bế tắc (Deadlock) giữa các tiến trình: " + jobList);
                }
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