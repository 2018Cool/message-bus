const logPrefix = `[${window.location?.href ?? 'test'}]`;
export const Logger = {
  enabled: false,

  log(message: any, ...args: any[]) {
    if (!this.enabled) {
      return;
    }
    console.log(logPrefix, message, ...(args ?? []));
  },
  warn(message: any, ...args: any[]) {
    if (!this.enabled) {
      return;
    }
    console.warn(logPrefix, message, ...(args ?? []));
  },
  info(message: any, ...args: any[]) {
    if (!this.enabled) {
      return;
    }
    console.info(logPrefix, message, ...(args ?? []));
  },
  error(message: any, ...args: any[]) {
    if (!this.enabled) {
      return;
    }
    console.error(logPrefix, message, ...(args ?? []));
  },
};
