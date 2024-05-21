import {
  PageInfo,
  ReportData,
  ReportType,
  RouteType,
  TrackingSdkOptions,
} from "../type/index";
import { SDKVersion, wrap } from "../utils/util";

export default class TrackingSdk {
  private duration = {
    startTime: 0,
    value: 0,
  };
  // 需要埋点的事件集合
  private eventList = ["click", "dblclick", "mouseout", "mouseover"];
  // 埋点数据上报地址
  private reportUrl = "";
  private uid = "";

  constructor(options: TrackingSdkOptions) {
    // 重写 pushState、replaceState
    window.history.pushState = wrap("pushState");
    window.history.replaceState = wrap("replaceState");

    this.reportUrl = options.resporUrl;
    this.initJSError();
    this.initEventHandler();
    this.initPV();
  }

  // 初始化 错误类型埋点
  private initJSError() {
    // error 事件
    window.addEventListener("error", (e) => {
      this.report(ReportType.ERROR, {
        message: e.message,
      });
    });

    // promise 抛出的异常
    window.addEventListener("unhandledrejection", (e) => {
      this.report(ReportType.ERROR, {
        message: e.reason,
      });
    });
  }

  // 初始化交互事件埋点
  private initEventHandler() {
    this.eventList.forEach((event) => {
      window.addEventListener(event, (e: Event) => {
        const target = e.target as HTMLElement;
        const reportKey = target.getAttribute("report-key");
        if (reportKey) {
          this.report(ReportType.EVENT, {
            tagName: target.nodeName,
            tagText: target.nodeName,
            event,
          });
        }
      });
    });
  }

  private initPV() {
    window.addEventListener("pushState", () => {
      this.report(ReportType.PV, {
        type: RouteType.REPLACE,
        referrer: document.referrer,
      });
    });

    window.addEventListener("replaceState", () => {
      this.report(ReportType.PV, {
        type: RouteType.REPLACE,
        referrer: document.referrer,
      });
    });

    window.addEventListener("hashchange", () => {
      this.report(ReportType.PV, {
        type: RouteType.HASH,
        referrer: document.referrer,
      });
    });
  }

  private initPageDuration() {
    let self = this;
    function initDuration(): void {
      const time = new Date().getTime();
      self.duration.value = time - self.duration.startTime;

      self.report(ReportType.DURATION, {
        ...self.duration,
      });

      self.duration.startTime = time;
      self.duration.value = 0;
    }

    // 首次进入页面
    window.addEventListener("load", () => {
      // 记录时间
      const time = new Date().getTime();
      this.duration.startTime = time;
    });

    // 单页应用页面跳转(触发 replaceState)
    window.addEventListener("replaceState", () => {
      initDuration();
    });

    // 单页应用页面跳转(触发 pushState)
    window.addEventListener("pushState", () => {
      initDuration();
    });

    // 单页应用页面跳转(触发 popstate)
    window.addEventListener("popstate", () => {
      initDuration();
    });

    // 页面没有任何跳转, 直接关闭页面的情况
    window.addEventListener("beforeunload", () => {
      initDuration();
    });
  }

  // 用户可主动上报
  reportTracker(data: any) {
    this.report(ReportType.CUSTOM, data);
  }

  private getPageInfo(): PageInfo {
    const { width, height } = window.screen;
    const { userAgent } = navigator;
    return {
      uid: this.uid,
      title: document.title,
      url: window.location.href,
      time: new Date().getTime(),
      ua: userAgent,
      screen: `${width}x${height}`,
    };
  }

  private report(type: ReportType, data: any) {
    const reportData: ReportData = {
      ...this.getPageInfo(),
      type,
      data,
      sdk: SDKVersion,
    };

    if (navigator.sendBeacon) {
      navigator.sendBeacon(this.reportUrl, JSON.stringify(reportData));
    } else {
      const imgReq = new Image();
      imgReq.src = `${this.reportUrl}?param=${JSON.stringify(
        reportData
      )}&t=${new Date().getTime()}`;
    }
  }
}
