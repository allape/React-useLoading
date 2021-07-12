import React from 'react';
export declare type LoadFunction = (key?: string) => string;
export declare type LoadedFunction = (key: string) => boolean;
export declare type IsLoadingFunction = () => boolean;
export declare type UseLoadingReturn = [boolean, LoadFunction, LoadedFunction, IsLoadingFunction];
/**
 * loading hook
 * @param delay 延迟触发更改状态的时间(ms), 避免闪烁
 */
export default function useLoading(delay?: number): UseLoadingReturn;
export declare type PlusFunction = (newValue?: number) => void;
/**
 * 计数器, 用于触发key更改的
 * @param initValue 初始值
 */
export declare function useCounter(initValue?: number): [number, PlusFunction];
export interface LoadingContextValue {
    loading: boolean;
    load?: LoadFunction;
    loaded?: LoadedFunction;
}
export declare const LoadingContext: React.Context<LoadingContextValue>;
