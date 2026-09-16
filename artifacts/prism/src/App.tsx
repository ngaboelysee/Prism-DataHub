import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/Layout";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import HistoryPage from "@/pages/history";
import PersonasPage from "@/pages/personas";
import BattlePage from "@/pages/battle";
import DebatePage from "@/pages/debatePage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      {/* Home gets its own full-width layout */}
      <Route path="/" component={Home} />
      {/* All other pages use the shared Layout */}
      <Route>
        <Layout>
          <Switch>
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/history" component={HistoryPage} />
            <Route path="/personas" component={PersonasPage} />
            <Route path="/battle" component={BattlePage} />
            <Route path="/debate" component={DebatePage} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
