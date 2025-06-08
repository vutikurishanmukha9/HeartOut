import { useEffect, useRef, useCallback } from "react";

interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

export function useWebSocket(onMessage?: (data: WebSocketMessage) => void) {
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log("WebSocket connected");
        reconnectAttempts.current = 0;
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage?.(data);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.current.onclose = (event) => {
        console.log("WebSocket disconnected:", event.code, event.reason);
        
        // Attempt to reconnect if it wasn't a manual close
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          const timeout = Math.pow(2, reconnectAttempts.current) * 1000; // Exponential backoff
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            connect();
          }, timeout);
        }
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    } catch (error) {
      console.error("Error creating WebSocket connection:", error);
    }
  }, [onMessage]);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket not connected, message not sent:", message);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (ws.current) {
      ws.current.close(1000, "Manual disconnect");
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    sendMessage,
    disconnect,
    isConnected: ws.current?.readyState === WebSocket.OPEN
  };
}
