import { useCallback, useRef, useState } from 'react';
export default function useProxy(initialValue) {
    var _a = useState(initialValue), state = _a[0], setState = _a[1];
    var ref = useRef(initialValue);
    var setValue = useCallback(function (value) {
        setState(ref.current = value instanceof Function ? value(ref.current) : value);
    }, []);
    return [state, ref, setValue];
}
