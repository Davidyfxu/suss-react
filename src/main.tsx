import ReactDOM from 'react-dom/client';
import './main.css';
import App from './index.tsx';
import posthog from 'posthog-js';
import { SWRConfig } from 'swr';
import { swrConfig } from './config/swr';

posthog.init('phc_B2JMBBtoPuZwZHCminqFmrdWhFyb5eSCZ0iSJCMzDoV', {
  api_host: 'https://us.i.posthog.com',
  person_profiles: 'identified_only'
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <SWRConfig value={swrConfig}>
    <App />
  </SWRConfig>
);
