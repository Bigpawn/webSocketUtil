type EventTypes = "open" | "close" | "message" | "error" | "reconnect";

interface SocketOptions {
  url: string;
  customBase?: string;
  protocols?: string | string[];
  query?: Record<string, any>;
  greet?: Record<string, any>;
}

interface UseSocketOptions extends SocketOptions {
  reconnectCount?: number;
}