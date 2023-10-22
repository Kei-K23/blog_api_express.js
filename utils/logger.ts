import pino from "pino";

export default pino({
  transport: {
    target: "pino-pretty",
  },
  base: {
    pid: false,
  },
});
