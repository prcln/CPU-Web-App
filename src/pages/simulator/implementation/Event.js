class Event {
    constructor(line) {
        this.number= 0;
        this.memory= 0;
        this.runtime= 0;
        this.semaphore = 0;
        this.burstTime = 0;
        this.arrivalTime = 999999;
        this.description= 'INVALID EVENT';
        this.type='X';
        this.ParseLine(line);
    }

    ParseLine(line) {
        var res =  line.split(/[ ]+/)
        if (line.charAt(0) === 'A') {
            this.type= 'A';
            this.arrivalTime = parseInt(res[1],10);
            this.number= parseInt(res[2], 10); 
            this.memory= parseInt(res[3], 10);
            this.runtime= parseInt(res[4], 10);
            this.description= 'Job ' + this.number + ' (M: ' + this.memory + ', R: ' + this.runtime +')';
        }
        else if (line.charAt(0) === 'D') {
            this.type= 'D';
            this.arrivalTime = parseInt(res[1],10);
            this.description= 'Output Statistics';
        }
        else if (line.charAt(0) === 'S') {
            this.type= 'S';
            this.arrivalTime = parseInt(res[1],10);
            this.semaphore = parseInt(res[2],10);
            this.description= 'Semaphore ' + (this.semaphore+1) + ' Signal';
        }
        else if (line.charAt(0) === 'W') {
            this.type= 'W';
            this.arrivalTime = parseInt(res[1],10);
            this.semaphore = parseInt(res[2],10);
            this.description= 'Semaphore '+ (this.semaphore+1) +' Wait';
        }
        else if (line.charAt(0) === 'I') {
            this.type= 'I';
            this.arrivalTime = parseInt(res[1],10);
            this.burstTime = parseInt(res[2],10);
            this.description= 'I/O Burst For ' + this.burstTime + ' Cycles';
        }
        else {
            console.warn(`[Event Parser] Unrecognised line (expected A/D/S/W/I): "${line}"`);
        }
    }
}

export default Event;


// WEBPACK FOOTER //
// ./src/pages/simulator/implementation/Event.js