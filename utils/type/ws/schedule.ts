export interface Schedule {
    type: string;
    data: Data;
}

export interface Data {
    begin: Date;
    end:   Date;
}
