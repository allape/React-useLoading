import React from 'react';
export declare type OnChangeFunc = (loading: boolean) => void;
export declare type PushFunc = (key?: string) => string;
export declare type FinishFunc = (key: string) => boolean;
export declare type ExecFunc = <T>(runner: () => Promise<T>) => Promise<T>;
export declare type IsLoadingFunc = () => boolean;
export interface UseLoadingOptions {
    /**
     * delay for setLoading(false), prevent flashing; in unit `ms`
     * @default 100
     */
    delay?: number;
    /**
     * emit immediately on loading state changed
     */
    onChange?: OnChangeFunc;
}
export interface UseLoadingReturn {
    loading: boolean;
    push: PushFunc;
    finish: FinishFunc;
    execute: ExecFunc;
    isLoading: IsLoadingFunc;
}
export declare const LoadingContext: React.Context<UseLoadingReturn>;
export default function useLoading({ delay, onChange }?: UseLoadingOptions): UseLoadingReturn;
