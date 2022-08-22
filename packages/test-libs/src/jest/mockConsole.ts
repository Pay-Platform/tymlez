const originalDebug = console.debug;
const originalTrace = console.trace;
const originalInfo = console.info;
const originalLog = console.log;
const originalWarn = console.warn;
const originalError = console.error;

export function restoreConsole() {
  console.debug = originalDebug;
  console.trace = originalTrace;
  console.info = originalInfo;
  console.log = originalLog;
  console.warn = originalWarn;
  console.error = originalError;
}

export function suppressConsole({
  debug = true,
  trace = true,
  info = true,
  log = true,
  warn = true,
  error = true,
}: {
  debug?: boolean;
  trace?: boolean;
  info?: boolean;
  log?: boolean;
  warn?: boolean;
  error?: boolean;
} = {}) {
  if (debug) {
    console.debug = empty;
  }
  if (trace) {
    console.trace = empty;
  }
  if (info) {
    console.info = empty;
  }
  if (log) {
    console.log = empty;
  }
  if (warn) {
    console.warn = empty;
  }
  if (error) {
    console.error = empty;
  }
}

function empty() {
  // explicitly do nothing
}
