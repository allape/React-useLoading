import { useCallback, useState } from 'react';
export default function useCounter(initialValue) {
    if (initialValue === void 0) { initialValue = 0; }
    var _a = useState(initialValue), count = _a[0], setCount = _a[1];
    var tick = useCallback(function (value) {
        setCount(function (c) { return value !== null && value !== void 0 ? value : (c === Number.MAX_SAFE_INTEGER ? 1 : ++c); });
    }, []);
    return [count, tick];
}
