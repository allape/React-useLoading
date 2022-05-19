import { Dispatch, RefObject, SetStateAction } from 'react';
export default function useProxy<T = unknown>(initialValue: T): [T, RefObject<T>, Dispatch<SetStateAction<T>>];
