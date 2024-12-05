import ReactDOM from 'react-dom/client';
import './main.css';
import App from './index.tsx';
import posthog from 'posthog-js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 3600 * 24, // 1 d
      retry: 1
    }
  }
});

posthog.init('phc_B2JMBBtoPuZwZHCminqFmrdWhFyb5eSCZ0iSJCMzDoV', {
  api_host: 'https://us.i.posthog.com',
  person_profiles: 'identified_only'
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
