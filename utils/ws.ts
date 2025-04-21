import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

import { StartWatching } from "./type/ws/start_watching.ts";
import { Stream } from "./type/ws/stream.ts";
const send_data: StartWatching = {
  "type": "startWatching",
  "data": {
    "stream": {
      "quality": "super_low",
      "protocol": "hls",
      "latency": "low",
      "accessRightMethod": "single_cookie",
      "chasePlay": false,
    },
    "room": {
      "protocol": "webSocket",
      "commentable": true,
    },
    "reconnect": false,
  },
};
type Relive = {
  apiBaseUrl: string;
  channelApiBaseUrl: string;
  webSocketUrl: string;
  csrfToken: string;
  audienceToken: string;
}


export async function get_ws_url(live_url: string) {
  const res = await fetch(live_url);
  const text = await res.text();
  const dom = new DOMParser().parseFromString(text, "text/html");
  const script_tag = dom.querySelector("#embedded-data");
  //script_tag has data-props
  const data_props = script_tag?.getAttribute("data-props") as string;
  const data = JSON.parse(data_props).site.relive as Relive;
  if (!data.webSocketUrl) {
    console.error("No ws url found.");
    throw new Error("No ws url found.");
  }
  return data.webSocketUrl;
}

export function init_ws(ws_ulr: string, timeout = 10000): Promise<[Stream, WebSocket]> {
  return new Promise((resolve, reject) => {
    const ws_clinet = new WebSocket(ws_ulr);
    const timeoutId = setTimeout(() => {
      ws_clinet.close();
      reject(new Error('WebSocket connection timed out'));
    }, timeout);

    ws_clinet.onopen = () => {
      ws_clinet.send(JSON.stringify(send_data));

    ws_clinet.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "stream") {
        clearTimeout(timeoutId);
        const stream_data = data as Stream;
        resolve([stream_data,ws_clinet]);
      }
      if(data.type==="ping"){
        ws_clinet.send(JSON.stringify({type:"pong"}));
        ws_clinet.send(JSON.stringify({type:"keepSeat"}));
      }
      console.log(data);
    }
    };
    ws_clinet.onerror = (error) => {
      clearTimeout(timeoutId);
      ws_clinet.close();
      reject(error);
    };
  });
}
