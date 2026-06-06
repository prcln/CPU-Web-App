import React, { Component } from "react";
import './home.css';
class Home extends Component {
    render() {
      return (

<div id="container" className="frame">
	
	<div id="pageHeader">
		
		<h1>Operating Systems Project</h1>

	</div>
	
	
	<div id="contentContainer"> 
		<div id="content"> 

{/* <hr noshade size="2"/> */}

{/* <br/> */}

<h3>Problem</h3> (100 points) Design and implement a program (in any language) that 
simulates some of the job scheduling, CPU scheduling, and semaphore processing of an operating system.

<h3>Detailed Description and Requirements</h3>

<p>
When jobs initially arrive in the system, they are put on the job scheduling queue which is maintained in FIFO order.
The job scheduling algorithm is run when a job arrives or terminates.  Job scheduling allows as many jobs to enter the ready
state as possible given the following restriction: a job cannot enter the ready state if there is not enough free memory to accommodate
that job's memory requirement.  Do not start a job unless it is the first job on the job scheduling queue.  When a job terminates, its
memory is released, which may allow one or more waiting jobs to enter the ready state.
</p>

<p>
A job can only run if it requires less than or equal to the system's main memory capacity.  The system has a total of 512 blocks of usable memory.
If a new job arrives needing more than 512 blocks, it is rejected by the system with an appropriate error message.  Rejected jobs do not factor
into the final statistics (described below).
</p>

<p>Note that all jobs in the ready state must fit into available main memory.</p>

<p>
Process scheduling is managed as a multilevel feedback queue.  The queue has two levels, each queue is
organized as a FIFO, and both use a 
round robin scheduling technique.  New jobs are put on the first level when arriving in the ready state. When a job
from the first level is given access to the CPU, it is allowed a quantum of 100 time units.  If it exceeds that time
quantum, it is preempted and moves to the second level.
</p>

<p>
The jobs on the second level may only be allocated the CPU if there are no jobs on the first level.
When a job on the second level is given access to the CPU, it is allowed a quantum of 300 time units.  If it
exceeds that, it is preempted and put back on the second level of the ready queue.
</p>

<p>Process scheduling decisions are made whenever any process leaves the CPU for any reason (e.g., expiration of a quantum or job
termination).  When a job terminates, do job scheduling first, then process scheduling.  Also, give preference to first level
jobs (i.e., if a job from the second level of the ready queue is running, and a new job enters the first level, the running job is preempted to
the second level in favor of the first level job).
</p>

<p>While executing on the CPU, a job may require I/O, which preempts it to the I/O wait queue for the duration of its I/O burst.
</p>

<p>While executing on the CPU, a job may perform a semaphore operation.  Assume there are five semaphores shared among all jobs running in the system, numbered
0 through 4, each initialized to 1. If a job must wait because of a semaphore, it goes onto the appropriate wait queue until it is signaled.  There is a separate
wait queue for each semaphore.
</p>

<p>When a job completes, put it on a finished list for later processing.</p>

<p>The simulator is driven by the events read from standard input. Examples of possible events are given below. The first field will be the first
character of the line, and subsequent fields will be separated by one of more spaces or tabs.  The header of each field in the following examples
does not appear in the input stream.</p>

<h4>A new job arrives:</h4>

<pre>
Event Time Job Memory Run Time
A     140  12  24     2720
</pre>

<p>
Interpretation: job 12 arrives at time 140, requires 24 blocks of memory and uses the CPU for a total of 2720 time units.</p>

<h4>A job needs to perform I/O:</h4>

<pre>
Event Time I/O Burst Time
I     214  85
</pre>

<p>Interpretation: the job currently running on the CPU will not finish its quantum because at time 214 it needs to perform I/O for a duration of 
85 time units.</p>

<h4>A job performs a wait on a semaphore:</h4>

<pre>
Event Time Semaphore
W     550  2
</pre>

<p>Interpretation: the job currently running on the CPU performs a wait on semaphore number 2 which may or may not cause it to be preempted.
Initialize each semaphore to 1.</p>

<h4>A job performs a signal on a semaphore:</h4>

<pre>
Event Time Semaphore
S     622  2
</pre>

<p>Interpretation: the job currently running on the CPU performs a performs a signal on semaphore number 2 which may allow a job to re-enter the ready state.</p>

<h4>Display the status of the simulator:</h4>

<pre>
Event Time
D     214
</pre>

<p>Interpretation: display the status of the simulator at time 214.</p>

<p>You may assume that events appear on the input stream in ascending time order and no two
events happen at the same time.  However, realize that the events given in the input stream are not only events which your simulator must handle.  For instance,
a time quantum expiration is not an event given in the input stream, but it is an event which your simulator must handle.  Furthermore, an internal event, such
as a time quantum expiration, not in the input stream, may occur at the same time as an event in the input stream (e.g., a new job arrival). Events in
the input stream are external events.</p>

<p>The following is a list of internal events (i.e., not given on the input stream) which your simulator must handle:
<ul>
<li>I/O completion (C)</li>
<li>time quantum expiration (E)</li>
<li>job termination (T)</li>
</ul>
</p>

<p>Assume that context switching, semaphore operations, and displays take no simulator time (an unrealistic assumption in a real operating system).</p>

<p>When a display is requested, print the contents of all queues as well as the job currently running on the CPU to standard output using only the format
used in the sample output given below.</p>

<p>After processing all jobs, write the following to standard output (in this order, as shown on the sample output given below):

<ol>
<li>completion time for each job (in order of completion),</li>
<li>average turnaround time (where turnaround time is defined as completion time minus arrival time), and</li>
<li>average job scheduling wait time (where wait time is defined as the number of time units spent in the job scheduling queue).</li>
</ol>

<h3>Event Collisons</h3>

<p>Often more than one event happen at the same time.  Use the following rules to determine which events to process first:

<ul>
<li>If an internal event (e.g., an event not on the input stream such as time slice expiration, I/O completion, or job termination) and an 
external event (i.e., an event given explicitly on the input stream) happen at the same time, process the internal event first.</li>
<li>If a job is scheduled to come off the I/O wait queue at the same time a job is scheduled to come
off the semaphore wait queue, take the job off the I/O wait queue first.</li>
</ul>
</p>
<h3>Architectural View of the Simulator</h3>

<img src="http://academic.udayton.edu/SaverioPerugini/courses/Spring2009/cps346/projects/p2.png" alt=""/>

<h3>Additional Requirements</h3>

<li>Your system must be developed and run on the cpssuse systems.  Mutliple programming languages
are available on these systems, including C (<tt>/usr/bin/gcc</tt>), C++ (<tt>/usr/bin/g++</tt>), Java (<tt>/usr/bin/javac</tt>, 
<tt>/usr/bin/java</tt>), Go (<tt>/usr/local/go/bin/go</tt>), Perl (<tt>/usr/bin/perl</tt>), and Python (<tt>/usr/bin/python</tt>).  If the language you want to
develop your simulator is absent from the system, let us know and we will try to get it installed.</li>

<li>Your implementation must be distributed across more than one source code file, in some sensible manner which reflects the logical purpose of the various components of
your design, to encourage problem decomposition and modular design.</li>

<li>Include a <tt>README</tt> file in your submission which describes (i) the language you used to develop your program and (ii) the name of the compiler or interpreter

which you used to compile or interpret your program.


</li>


<li>If you develop your simulator in a compiled language (e.g., C, C++, Java), you must provide a <tt>Makefile</tt>.
Your <tt>Makefile</tt> must include target directives for every derived file
produced during the compilation process (i.e., each program, each object file,
and any other intermediate files produced during code compilation).
Make sure that each
directive also lists all files on which the derived file depends in its
dependency list.  Also, your <tt>Makefile</tt> must be written so carries out
<em>only</em> the commands <em>necessary</em> to bring any produced file
up-to-date.  Your <tt>Makefile</tt> must do just enough, but no extra, work to
bring the executable for your
simulator up-to-date every time <tt>make</tt> is invoked.  In
addition, it must have an <tt>all</tt> directive and a <tt>clean</tt> directive
to remove all generated files
Use variables where appropriate in your <tt>Makefile</tt> to improve its
readability.  Your <tt>Makefile</tt> must bring everything up-to-date,
without any warnings or errors, when <tt>make</tt> is
invoked on our system.</li>
</p>

<h3>Hints and notes</h3>

<ul>

<li>You are advised to define a PCB (process control block) structure and use it as a node in the various queues of your simulator.</li>
<li>When debugging your simulator, you are advised to add extra display events to the sample input to trace the movement of jobs throughout the 
various queues of the system.</li>
<li>You are advised to organize jobs on the I/O wait queue in the order in which they are scheduled to come off (i.e., make the I/O queue a priority queue) to
obviate having to search the queue for the next job to come off of it everytime an I/O operation completes.</li>
<li>You are advised to organize jobs on each of the 5 semaphore wait queues in FIFO order.</li>
<li>Since this program involves so many queues (I count 10), you are advised to use a programming language which has
list operations built into the language, such as Python, or one which provides a queue data structure in a standard library,
such as Java or C++.  You are advised against re-inventing the wheel.  You are also advised against using this 
project as an opportunity to learn a new language.  Use tools with which you are already familiar and focus on the operating
systems aspects of the project.</li>
<li>If designed properly,
the program required to solve this project should occupy no more than 1,000 lines of code (or less if you use built-in data structures or data structures from
libraries).</li>
</ul>

<h3>Test data: sample input and output streams</h3>

<ol>
<li>(only events A &amp; D, &amp; E &amp; T) <a href="http://academic.udayton.edu/SaverioPerugini/courses/Fall2010/cps346/projects/p2stdin_a.txt">p2stdin_a</a> and <a href="http://academic.udayton.edu/SaverioPerugini/courses/Fall2010/cps346/projects/p2stdout_a.txt">p2stdout_a</a> [<a href="http://academic.udayton.edu/SaverioPerugini/courses/Spring2009/cps346/projects/p2a.png">image</a>]</li>

<li>(only events A, I, &amp; D, &amp; E, C, &amp; T) <a href="http://academic.udayton.edu/SaverioPerugini/courses/Fall2010/cps346/projects/p2stdin_b.txt">p2stdin_b</a> and <a href="http://academic.udayton.edu/SaverioPerugini/courses/Fall2010/cps346/projects/p2stdout_b.txt">p2stdout_b</a> [<a href="http://academic.udayton.edu/SaverioPerugini/courses/Spring2009/cps346/projects/p2b.png">image</a>]</li>

<li>(all events: A, I, W, S, &amp; D, &amp; E, C, &amp; T)
<a href="http://academic.udayton.edu/SaverioPerugini/courses/Fall2010/cps346/projects/p2stdin_c.txt">p2stdin_c</a> and <a href="http://academic.udayton.edu/SaverioPerugini/courses/Fall2010/cps346/projects/p2stdout_c.txt">p2stdout_c</a>
[<a href="http://academic.udayton.edu/SaverioPerugini/courses/Spring2009/cps346/projects/p2.png">image</a>]</li>
</ol>

<p>This test data is available at <tt>/home/perugini_cps346/share/projects/p2/</tt>.
At first, simply try to get only one job through your 
system.  Once you are confident that your system processes only one job properly, try to get two jobs through the system.</p>
While developing your simulator, you are encouraged to get it to work on the simple test input first (<tt>p2d.dat</tt>) and
progressively enhance and refine your system to the point where it works on the most complex test input (<tt>p2a.dat</tt>).</div>

<p>Use the UNIX <tt>diff</tt> utility to compare your output to the correct output.
For full credit, the output produced by your program must have zero differences,
as defined by <tt>diff</tt>, with the output posted here.</p>

<p>There is also a reference executable of a solution for this project available 
at <tt>/home/perugini_cps346/share/projects/p2/OSsim</tt>.

{/* <h3>How to submit</h3>

<p><b>Note</b>: All directory and filenames below are
<i>case-sensitive</i>.
You must use the directory and filenames exactly as shown below,
(i.e., all lower case).</p>

<p>Prepare your submission file as
<tt>/home/</tt>&lt;<i>logname</i>&gt;<tt>/projects/p2/p2.tar</tt>.
This archive must contain only the most minimal set of
files necessary to build your simulator from scratch.  Only the file
<tt>/home/</tt>&lt;<i>logname</i>&gt;<tt>/projects/p2/p2.tar</tt>
will be electronically collected from
your account on the deadline. 
</p>

<p>Failure to follow these submission requirements will result in a 10% penalty.</p> */}

<h3>Evaluation</h3>

<p>Ninety percent of your score will come from correctness and 10% of your
score will come from following our <a href="http://academic.udayton.edu/SaverioPerugini/courses/cps444/style.html">programming style
guide</a>.  Applicable submission penalties will then be applied.
</p>

In an effort to award partial credit to students who are unable to complete certains
parts of this project, students earn up to four different portions of the 90 possible points for correctness:

<ul>
<li>If your program produces this <a href="http://academic.udayton.edu/SaverioPerugini/courses/Fall2010/cps346/projects/p2stdout_c.txt">p2stdout_c</a> exactly when run on <a href="http://academic.udayton.edu/SaverioPerugini/courses/Fall2010/cps346/projects/p2stdin_c.txt">p2stdin_c</a> (all events: A, I, W, S, &amp D, &amp T, E, &amp; C), you
can earn up to 90 points.</li>

<li>If your program produces this <a href="http://academic.udayton.edu/SaverioPerugini/courses/Fall2010/cps346/projects/p2stdout_b.txt">p2stdout_b</a> exactly when run on <a href="http://academic.udayton.edu/SaverioPerugini/courses/Fall2010/cps346/projects/p2stdin_b.txt">p2stdin_b</a> (only events A, I, &amp; D, &amp; T, E, &amp; C), you
can only earn up to 65 points.</li>

<li>If your program produces this <a href="http://academic.udayton.edu/SaverioPerugini/courses/Fall2010/cps346/projects/p2stdout_a.txt">p2stdout_a</a> exactly when run on <a href="http://academic.udayton.edu/SaverioPerugini/courses/Fall2010/cps346/projects/p2stdin_a.txt">p2stdin_a</a> (only events A &amp; D, &amp; T &amp; E), you
can only earn up to 40 points.</li>

<li>If your program does not produce this <a href="http://academic.udayton.edu/SaverioPerugini/courses/Fall2010/cps346/projects/p2stdout_a.txt">p2stdout_a</a> exactly when run on <a href="http://academic.udayton.edu/SaverioPerugini/courses/Fall2010/cps346/projects/p2stdin_a.txt">p2stdin_a</a>, you
will not earn any points.</li>

<li>If your program does not compile or execute without errors or warnings, you will not earn any points.</li>
</ul>

<p>
<i>Note</i>:  Depending on how you order the jobs on your I/O wait queue, your dump of the jobs waiting for I/O may not match our output exactly, and for just
that queue, that is acceptable. For instance, you might organize your I/O wait queue as a priority queue where the job which comes off first is at the head, or
you might maintain jobs on the I/O wait queue in the order in which they are put on and then search for the job to take off when the I/O is complete.</p>

<hr noshade size="2"/>
{/* <a href="#container"><img border="0" src="http://academic.udayton.edu/SaverioPerugini/images/rh.jpg" alt="Return Home" border="0"/></a> */}
		</p> 
	</div> 
	
	<div class="clearer"></div>
	
	<div id="footer"> 
		<div id="breadcrumbcontainer"> 
			
		</div> 
		<p></p>
	</div> 

</div> 
      );
    }
  }
   
export default Home;


// WEBPACK FOOTER //
// ./src/pages/home/Home.js