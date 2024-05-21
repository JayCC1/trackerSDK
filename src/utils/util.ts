export const SDKVersion = "1.0.0";

export const wrap = <T extends keyof History>(event: T) => {
  const func = history[event];
  return function () {
    const res = func.apply(this, arguments);
    const e = new Event(event);
    window.dispatchEvent(e);
    return res;
  };
};
