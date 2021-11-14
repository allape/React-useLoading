import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
/**
 * loading hook
 * @param delay 延迟触发更改状态的时间(ms), 避免闪烁
 */
export default function useLoading(delay) {
    if (delay === void 0) { delay = 100; }
    var _a = useState(false), loading = _a[0], setLoading = _a[1];
    var _b = useCounter(), count = _b[0], plus = _b[1];
    var _c = useContext(LoadingContext), globalLoad = _c.load, globalLoaded = _c.loaded;
    var setLoadingProxy = useCallback(function (loading) {
        setLoading(loading);
    }, [setLoading]);
    var queue = useMemo(function () { return []; }, []);
    var load = useCallback(function (key) {
        key = key || Date.now() + "_" + Math.random() + "_" + Math.random();
        if (globalLoad && globalLoad !== NotImplementedError) {
            globalLoad(key);
        }
        queue.push(key);
        plus();
        return key;
    }, [queue, plus, globalLoad]);
    var loaded = useCallback(function (key) {
        if (globalLoaded && globalLoaded !== NotImplementedError) {
            globalLoaded(key);
        }
        var index = queue.indexOf(key);
        if (index !== -1) {
            queue.splice(index, 1);
            plus();
            return true;
        }
        return false;
    }, [queue, plus, globalLoaded]);
    // 最精确的判断当前是否在loading, 用于那些不能依靠loading state更改来监听操作的操作
    var isLoading = useCallback(function () {
        return queue.length > 0;
    }, [queue]);
    useEffect(function () {
        var loading = queue.length > 0;
        if (!loading) {
            var id_1 = setTimeout(function () { return setLoadingProxy(queue.length > 0); }, delay);
            return function () { return clearTimeout(id_1); };
        }
        else {
            setLoadingProxy(loading);
        }
    }, [count, queue, delay, setLoadingProxy]);
    // useEffect(() => {
    //   if (withAutoClear) {
    //     const intervalId = setInterval(() => {
    //       setLoading(queue.length > 0)
    //     }, 1000)
    //     return () => {
    //       clearInterval(intervalId)
    //     }
    //   }
    // }, [withAutoClear, setLoading, queue])
    return useMemo(function () { return ({ loading: loading, load: load, loaded: loaded, isLoading: isLoading }); }, [loading, load, loaded, isLoading]);
}
/**
 * 计数器, 用于触发key更改的
 * @param initValue 初始值
 */
export function useCounter(initValue) {
    if (initValue === void 0) { initValue = 0; }
    var _a = useState(initValue), count = _a[0], setCount = _a[1];
    var plus = useCallback(function (newValue) {
        setCount(function (c) { return newValue === undefined ? (c === Number.MAX_SAFE_INTEGER ? 1 : (c + 1)) : newValue; });
    }, []);
    return [count, plus];
}
var NotImplementedError = function () {
    throw new Error('Not implemented yet!');
};
export var LoadingContext = React.createContext({
    loading: false,
    load: NotImplementedError,
    loaded: NotImplementedError,
    isLoading: NotImplementedError,
});
