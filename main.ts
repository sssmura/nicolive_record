import { get_cookies, get_live_data } from "./utils/live.ts";
import { init_ws, get_ws_url } from "./utils/ws.ts";
import { exec_ffmpeg_ts_record } from "./utils/rec.ts";
const Stremer = {
  "maisuri": 126573158,
  "shin": 138192593,
  "noa": 121590896,
  "sanou": 136757393
}
const isRecording = {
  "maisuri": false,
  "shin": false,
  "noa": false,
  "sanou": false
}
type Name = keyof typeof isRecording;


async function main(name: Name) {
  if (isRecording[name]) return;
  const BASE_URL = "https://live.nicovideo.jp/watch/";
  try {
    const liveData = await get_live_data(Stremer[name])
    if (liveData.status === "OFFLINE") {
      return;
    }
    isRecording[name] = true
    const wsUrl = await get_ws_url(BASE_URL + liveData.slug);
    const cookie = await get_cookies(BASE_URL + liveData.slug);
    const [streamData, ws_clinet] = await init_ws(wsUrl);
    const stream_cookie = streamData.data.cookies;
    const cookie_for_record = cookie + `;${stream_cookie[0].name}=${stream_cookie[0].value}`
    await exec_ffmpeg_ts_record(streamData.data.uri, cookie_for_record);
    ws_clinet.close();
    isRecording[name] = false;
  } catch (err) {
    console.error("処理中にエラー:", err);
    isRecording[name] = false;
  }
}

setInterval(() => {
  main("maisuri")
  main("shin")
  main("noa")
  main("sanou")
}, 1000 * 15);


