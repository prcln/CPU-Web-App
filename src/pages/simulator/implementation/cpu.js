//import React from "react";

import Job from "./job";

class CPU {
    constructor() {
        this.job = new Job();
        this.quantum = 0;
        this.idle = true;
    }

    AddJob(job, quantum) {
        if (!this.idle) {
            console.log("ERROR: CPU is BUSY");
        }
        this.quantum = quantum > 0 ? quantum : 100000000000;
        this.job = job;
        this.idle = false;
    }

    GetString() {
        if (this.idle) {
            return "CPU IDLE";
        }
        return "Job " + this.job.JobNumber + "\nRequires: " +
            (this.job.NeededRunTime - this.job.RunTime) + "\nQuantum: " +
            this.quantum;
    }

    Run(currentTime) {
        if (this.idle) {
            return false;
        }

        var done = this.job.Run(currentTime);
        this.quantum = this.quantum - 1;

        if(this.quantum === 0 || done) {
            this.idle = true;
            return true;
        }

        return false;
    }
}

export default CPU;


// WEBPACK FOOTER //
// ./src/pages/simulator/implementation/cpu.js