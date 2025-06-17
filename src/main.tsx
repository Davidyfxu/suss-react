import ReactDOM from 'react-dom/client';
import './main.css';
import App from './index.tsx';
import posthog from 'posthog-js';
import { SWRConfig } from 'swr';
import { swrConfig } from './config/swr';
import { PostHogProvider } from 'posthog-js/react'

posthog.init('phc_B2JMBBtoPuZwZHCminqFmrdWhFyb5eSCZ0iSJCMzDoV', {
  api_host: 'https://us.i.posthog.com',
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <PostHogProvider client={posthog}>
    <SWRConfig value={swrConfig}>
      <App />
    </SWRConfig>
  </PostHogProvider>
);
