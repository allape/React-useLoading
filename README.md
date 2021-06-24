# Loading State

### Example

```typescript jsx
import {useCallback} from 'react';
import useLoading from './index';

async function fetch(): Promise<string> {
  return new Promise<string>(resolve =>
    setTimeout(() => resolve(
      new Date().toLocaleDateString()),
      Math.random() * 10000
    )
  );
}

export default function App() {
  const [loading, load, loaded] = useLoading();

  const doFetch = useCallback(() => {
    const loadingKey = load();
    fetch().then(res => {
      console.log(res);
    }).finally(() => {
      loaded(loadingKey);
    });
  }, [load, loaded]);

  return <Button loading={loading} onClick={doFetch}>Fetch</Button>;
}
```
