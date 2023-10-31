import {
  CLOSE_ABNORMAL,
  DEFAULT_CHECK_COUNT,
  DEFAULT_CHECK_DATA,
  DEFAULT_CHECK_TIME,
} from "../constant";
import EventMap from "./eventMap";

class Socket extends WebSocket {
  private heartCheckData: any = DEFAULT_CHECK_DATA;
  private heartCheckTimeout: number = DEFAULT_CHECK_TIME;
  private heartCheckInterval: any | null = null;
  private heartCheckCount: number = DEFAULT_CHECK_COUNT;
  _currentOptions: SocketOptions;
  _dep: EventMap;
  _reconnectCount: number;

  constructor(options: SocketOptions, dep: EventMap, reconnectCount = 0) {
    const {
      url,
      customBase = null,
      protocols,
      query = {},
      greet = null,
    } = options;
    let _baseUrl = customBase ?? "";

    const _queryParams = Object.keys(query).reduce(
      (str: string, key: string) => {
        if (
          typeof query[key] !== "object" &&
          typeof query[key] !== "function"
        ) {
          return (str +=
            str?.length > 0 ? `&${key}=${query[key]}` : `${key}=${query[key]}`);
        } else {
          return str;
        }
      },
      ""
    );

    super(
      `${_baseUrl}${url}${_queryParams.length > 0 ? `?${_queryParams}` : ""}`,
      protocols
    );

    this._currentOptions = options;
    this._dep = dep;
    this._reconnectCount = reconnectCount;

    if (greet) {
      Object.assign(this, {
        heartCheckData: greet,
      });
    }

    this.initSocket();
  }

  private initSocket() {
    this.onopen = (e) => {
      this._dep.notify("open", e);
      this.heartCheckStart();
    };

    this.onclose = (e) => {
      this._dep.notify("close", e);
      if (e.code === CLOSE_ABNORMAL) {
        if (this._reconnectCount < this.heartCheckCount) {
          this._reconnectCount++;
          const _socket = new Socket(
            this._currentOptions,
            this._dep,
            this._reconnectCount
          );
          this._dep.notify("reconnect", _socket);
        } else {
          return console.error("WebSocket重连失败, 请联系技术客服!");
        }
      }
    };

    this.onerror = (e) => {
      this._dep.notify("error", e);
    };

    this.onmessage = (e) => {
      // 如果返回的为二进制数据
      if (e.data instanceof Blob) {
        const render = new FileReader();
        render.readAsArrayBuffer(e.data);
        render.onload = (ev) => {
          if (ev.target?.readyState === FileReader.DONE) {
            this._dep.notify("message", ev.target?.result);
          }
        };
      } else {
        // 处理普通数据
        try {
          const _parseData = JSON.parse(e.data);
          this._dep.notify("message", _parseData);
        } catch (error) {
          console.log(error);
        }
      }
    };
  }

  /**
   * 订阅事件
   * @param eventType EventTypes 订阅事件名称
   * @param callback 回调函数
   */
  public subscribe(eventType: EventTypes, callback: (event: any) => void) {
    if (typeof callback !== "function")
      throw new Error("The second param is must be a function");
    this._dep.depend(eventType, callback);
  }

  /**
   * 发送消息
   * @param data 发送内容
   * @param options
   */
  public sendMessage(data: any, options: { transformJSON?: boolean } = {}) {
    const { transformJSON = true } = options;
    let result = data;
    if (transformJSON) {
      result = JSON.stringify(data);
    }
    this.send(result);
  }

  /**
   * 关闭socket🔗
   * @param code
   * @param reason
   */
  public closeSocket(code?: number, reason?: string) {
    this.close(code, reason);
  }

  private heartCheckStart() {
    this.heartCheckInterval = setInterval(() => {
      if (this.readyState === this.OPEN) {
        let transformJSON = typeof this.heartCheckData === "object";
        this.sendMessage(this.heartCheckData, { transformJSON });
      } else {
        this.clearHeartCheck();
      }
    }, this.heartCheckTimeout);
  }

  // 清除心跳检测
  private clearHeartCheck() {
    clearInterval(this.heartCheckInterval);
  }

  // 重置心跳检测
  public resetHeartCheck() {
    clearInterval(this.heartCheckInterval);
    this.heartCheckStart();
  }
}

const useSocket = (options: UseSocketOptions) => {
  if (!window.WebSocket)
    return console.error("您的浏览器不支持WebSocket, 请更换浏览器!");

  const dept = new EventMap();

  return new Socket(options, dept, options.reconnectCount || 0);
};

export default useSocket;
