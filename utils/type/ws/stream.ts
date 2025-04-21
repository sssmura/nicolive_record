export interface Stream {
    type: string;
    data: Data;
}

export interface Data {
    uri:                string;
    syncUri:            string;
    quality:            string;
    availableQualities: string[];
    protocol:           string;
    cookies:            Cooky[];
}

export interface Cooky {
    name:    string;
    value:   string;
    expires: string;
    domain:  string;
    path:    string;
    secure:  boolean;
}
