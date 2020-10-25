export enum TrackingState {
    Unchanged,
    Added,
    Modified,
    Deleted
}

export interface TrackableEntity {
    trackingState: TrackingState;
    modifiedProperties?: string[];
}
