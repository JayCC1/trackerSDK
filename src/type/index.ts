// 上报数据的类型
export enum ReportType {
  PV = "pv",
  EVENT = "event",
  CUSTOM = "custom",
  ERROR = "error",
  DURATION = "duration",
}

// 路由跳转的类型
export enum RouteType {
  PUSH = "pushState",
  REPLACE = "replaceState",
  HASH = "hashchange",
}

// trickingSdk 配置项
export interface TrackingSdkOptions {
  resporUrl: string;
}

// 页面信息
export interface PageInfo {
  uid?: string;
  title: string;
  url: string;
  time: number;
  ua: string;
  screen: string;
}

// 上报的数据格式
export interface ReportData extends PageInfo {
  type: ReportType;
  data: any;
  sdk: string;
}
