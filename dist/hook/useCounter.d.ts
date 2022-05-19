export declare type TickFunction = (newValue?: number) => void;
export default function useCounter(initialValue?: number): [number, TickFunction];
