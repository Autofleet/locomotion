export interface CancellationReason {
    id: string;
    value: string;
    businessModelId: string;
    rideType: string;
    rideState: string;
    category: string;
}

export interface CancellationReasonsContextInterface {
    cancellationReasons: CancellationReason[];
    getCancellationReasons: (rideId?: string) => Promise<void>;
    clearCancellationReasons: () => void;
}
