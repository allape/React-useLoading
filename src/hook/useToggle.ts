import { useCallback, useState } from 'react';

export type MakeItTrue = () => void
export type MakeItFalse = () => void

export default function useToggle(
  defaultValue = false,
  onChange?: (v: boolean) => void,
): [boolean, MakeItTrue, MakeItFalse] {
  const [state, setState] = useState<boolean>(defaultValue);
  const makeItTrue = useCallback(() => {
    onChange?.(true);
    setState(true);
  }, [onChange]);
  const makeItFalse = useCallback(() => {
    onChange?.(false);
    setState(false);
  }, [onChange]);
  return [state, makeItTrue, makeItFalse];
}
