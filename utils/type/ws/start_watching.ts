export interface StartWatching {
  type: string;
  data: Data;
}

export interface Data {
  stream:    Stream;
  room:      Room;
  reconnect: boolean;
}

export interface Room {
  protocol:    string;
  commentable: boolean;
}

export interface Stream {
  quality:           string;
  protocol:          string;
  latency:           string;
  accessRightMethod: string;
  chasePlay:         boolean;
}




