import { t } from "../../../language/i18n";

class Job {
    constructor(ID, arrivalTime, runTime, Memory) {
        this.JobNumber = ID;
        this.ArrivalTime = arrivalTime;
        this.Memory = Memory;
        this.NeededRunTime = runTime;
        this.NeededIOBurstTime = 0;

        this.RunTime = 0;
        this.IOBurstTime = 0;
        this.SemaphorWaitTime = 0;

        this.hasRun = false;
        this.Done = false;

        this.StartTime = -1;
        this.FinishTime = -1;

        this.stateReason = t("tt_created", ID);
    }

    RemainingRunTime() {
        return this.NeededRunTime - this.RunTime;
    }

    RemainingBurstTime() {
        return this.NeededIOBurstTime - this.IOBurstTime;
    }

    AddIOTime(BurstTime) {
        this.NeededIOBurstTime += BurstTime;
    }

    WaitIO() {
        this.IOBurstTime++;
        return (this.IOBurstTime >= this.NeededIOBurstTime);
    }

    WaitSemaphore() {
        this.SemaphorWaitTime++;
    }

    Run(CurrentTime) {
        if (!this.hasRun) {
            this.hasRun = true;
            this.StartTime = CurrentTime;
        }

        this.RunTime++;

        if (this.RunTime >= this.NeededRunTime) {
            this.Done = true;
            this.FinishTime = CurrentTime;
        }

        return this.Done;
    }

}

export default Job;


// WEBPACK FOOTER //
// ./src/pages/simulator/implementation/job.js