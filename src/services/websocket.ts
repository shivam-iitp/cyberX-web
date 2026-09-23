type WebSocketCallback = (message: { type: string; data: any }) => void;

class WebSocketStreamService {
  private ws: WebSocket | null = null;
  private listeners: Set<WebSocketCallback> = new Set();
  private reconnectTimeout: any = null;
  private isConnected: boolean = false;

  public connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws/live-stream`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.isConnected = true;
        console.log('[WS] Connected to Live Threat Stream');
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = null;
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          this.listeners.forEach((callback) => callback(parsed));
        } catch (e) {
          // ignore non-json messages
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        console.log('[WS] Disconnected. Attempting reconnect in 3s...');
        this.scheduleReconnect();
      };

      this.ws.onerror = (err) => {
        console.warn('[WS] Stream error:', err);
        if (this.ws) {
          this.ws.close();
        }
      };
    } catch (e) {
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (!this.reconnectTimeout) {
      this.reconnectTimeout = setTimeout(() => {
        this.connect();
      }, 3000);
    }
  }

  public subscribe(callback: WebSocketCallback) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  public getStatus() {
    return this.isConnected;
  }
}

export const wsStream = new WebSocketStreamService();
