const isLoggingEnabled = true;
export const log = (...message) => {
  if (isLoggingEnabled) {
    console.log(...message);
  }
};

export const error = (...message) => {
  if (isLoggingEnabled) {
    console.error(...message);
  }
};
