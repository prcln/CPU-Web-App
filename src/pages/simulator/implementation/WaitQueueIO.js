// import Job from "./job";

class WaitQueueIO {
    constructor() {
        this.WaitQueue = []
    }

    AddJob(job, burstTime) {
        job.AddIOTime(burstTime)
        this.WaitQueue.push(job)
        this.WaitQueue.sort(function(a, b){
            return (a.NeededIOBurstTime - a.IOBurstTime) - (b.NeededIOBurstTime - b.IOBurstTime);
        });
    }

    RunJobs() {
        var MoveJobs = [];
        for (var i = 0; i< this.WaitQueue.length; i++) {
            while(i < this.WaitQueue.length && this.WaitQueue[i].WaitIO()) {
                MoveJobs.push(this.WaitQueue.shift());
            }
        }
        return MoveJobs;
    }
}

export default WaitQueueIO;


// WEBPACK FOOTER //
// ./src/pages/simulator/implementation/WaitQueueIO.js