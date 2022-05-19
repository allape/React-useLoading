var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import React, { useCallback, useContext, useEffect, useRef } from 'react';
import NotImplementedError from '../error/NotImplementedError';
import useCounter from './useCounter';
import useProxy from './useProxy';
export var LoadingContext = React.createContext({
    loading: false,
    execute: NotImplementedError,
    push: NotImplementedError,
    finish: NotImplementedError,
    isLoading: NotImplementedError,
});
export default function useLoading(_a) {
    var _this = this;
    var _b = _a === void 0 ? {} : _a, _c = _b.delay, delay = _c === void 0 ? 100 : _c, onChange = _b.onChange;
    var _d = useProxy(false), loading = _d[0], loadingProxy = _d[1], setLoading = _d[2];
    var _e = useCounter(), count = _e[0], tick = _e[1];
    var _f = useContext(LoadingContext), globalPush = _f.push, globalFinish = _f.finish;
    var queueRef = useRef([]);
    var push = useCallback(function (key) {
        key = key || "".concat(Date.now(), "_").concat(Math.random(), "_").concat(Math.random());
        if (globalPush && globalPush !== push && globalPush !== NotImplementedError) {
            try {
                globalPush(key);
            }
            catch (e) {
                console.error('failed to call "push" function in context');
            }
        }
        queueRef.current.push(key);
        tick();
        return key;
    }, [tick, globalPush]);
    var finish = useCallback(function (key) {
        if (globalFinish && globalFinish !== finish && globalFinish !== NotImplementedError) {
            try {
                globalFinish(key);
            }
            catch (e) {
                console.error('failed to call "finish" function in context:', e);
            }
        }
        var queue = queueRef.current;
        var index = queue.indexOf(key);
        if (index !== -1) {
            queue.splice(index, 1);
            tick();
            if (onChange &&
                ((loadingProxy.current && queue.length === 0)
                    ||
                        (!loadingProxy.current && queue.length > 0))) {
                onChange(queue.length > 0);
            }
            return true;
        }
        return false;
    }, [onChange, tick, globalFinish]);
    var execute = useCallback(function (runner) { return __awaiter(_this, void 0, void 0, function () {
        var lk;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    lk = push();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, runner()];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    finish(lk);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [push, finish]);
    var isLoading = useCallback(function () { return queueRef.current.length > 0; }, []);
    useEffect(function () {
        var loading = queueRef.current.length > 0;
        if (loading) {
            setLoading(loading);
        }
        else {
            var id_1 = setTimeout(function () { return setLoading(queueRef.current.length > 0); }, delay);
            return function () { return clearTimeout(id_1); };
        }
    }, [count, delay, setLoading]);
    return {
        loading: loading,
        push: push,
        finish: finish,
        execute: execute,
        isLoading: isLoading,
    };
}
