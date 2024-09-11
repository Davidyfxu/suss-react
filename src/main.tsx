import ReactDOM from 'react-dom/client';
import './main.css';
import App from './index.tsx';
import posthog from 'posthog-js';

posthog.init('phc_B2JMBBtoPuZwZHCminqFmrdWhFyb5eSCZ0iSJCMzDoV', {
  api_host: 'https://us.i.posthog.com',
  person_profiles: 'identified_only' // or 'always' to create profiles for anonymous users as well
});
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
