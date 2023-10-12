function _1(md){return(
md`# \`console.log\` without leaving your notebook

Sometimes you do not have the browser developer tools available. For example when playing around with a notebook on an iPad. This notebook hooks into your \`console.log\` calls and puts them in array you can inspect directly in your notebook.

## Import

\`\`\`javascript
import {log} from '@sorig/console-log-without-leaving-your-notebook'
\`\`\`

If you need to control initial execution order you should also import \`consoleHook\`:

\`\`\`javascript
import {log, consoleHook} from '@sorig/console-log-without-leaving-your-notebook'
\`\`\`

If you only care about the most recent log messages:
\`\`\`javascript
import {logTail} from '@sorig/console-log-without-leaving-your-notebook'
\`\`\`

If you want a markdown table of the most recent log messages
\`\`\`javascript
import {logTable} from '@sorig/console-log-without-leaving-your-notebook'
\`\`\`


## Usage
Put the \`log\` in a cell. Then start sending log messages from any of your cells:
`
)}

function _2(log){return(
log
)}

function _3(consoleHook)
{
  /* consoleHook is needed to ensure that the console hook is executed before this cell.
     This is only relevant if you have to control the execution order on a page reload. 
     When playing around and debugging a notebook this is generally not necessary */
  consoleHook;
  
  console.log(1);
  console.log(2);
  console.log(3);
  console.log(4);
  console.log(5);
  console.log(6);
  console.log(7);
  console.log(8);
  console.log(9);
  console.log(10);
  console.log('My log message')
  console.log({prop1: 'My log object'});
}


function _4(md){return(
md`### Example usage #1: Get the most recent log messages`
)}

function _logTail(log){return(
n => log.slice(-n)
)}

function _6(logTail){return(
logTail(5)
)}

function _7(md){return(
md`### Example usage #2: Make a log table`
)}

function _logTable(md,log){return(
n => {
  if (!n || n <= 0) n = 0;
  return md`
|   |console.log|
|---|-----------|
${Array(Math.max(n, log.length)).fill().map((_, i) => log[i] ? `|#${i+1}|${log[i]}|\n` : '| - | - |\n').slice(-n)}
`
}
)}

function _9(logTable){return(
logTable(10)
)}

function _10(md){return(
md`## Implementation`
)}

function _log(consoleHook,logHistoryUpdated)
{
  consoleHook
  logHistoryUpdated
  return console.logs.slice();
}


function _consoleHook($0)
{
  if (!console.stdlog) {
    console.stdlog = console.log.bind(console);
    console.logs = [];
  }
  
  console.log = function(){
    console.logs.push(Array.from(arguments));
    console.stdlog.apply(console, arguments)
    $0.value = true;
  }
}


function _logHistoryUpdated(){return(
false
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["log"], _2);
  main.variable(observer()).define(["consoleHook"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer("logTail")).define("logTail", ["log"], _logTail);
  main.variable(observer()).define(["logTail"], _6);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer("logTable")).define("logTable", ["md","log"], _logTable);
  main.variable(observer()).define(["logTable"], _9);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer("log")).define("log", ["consoleHook","logHistoryUpdated"], _log);
  main.variable(observer("consoleHook")).define("consoleHook", ["mutable logHistoryUpdated"], _consoleHook);
  main.define("initial logHistoryUpdated", _logHistoryUpdated);
  main.variable(observer("mutable logHistoryUpdated")).define("mutable logHistoryUpdated", ["Mutable", "initial logHistoryUpdated"], (M, _) => new M(_));
  main.variable(observer("logHistoryUpdated")).define("logHistoryUpdated", ["mutable logHistoryUpdated"], _ => _.generator);
  return main;
}
