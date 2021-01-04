export enum TrackingState {
    Unchanged = 0,
    Added = 1,
    Modified = 2,
    Deleted = 3
}

export interface TrackableEntity {
    trackingState: TrackingState;
    modifiedProperties: string[];
}
