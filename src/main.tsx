import ReactDOM from "react-dom/client"
import "./index.css"
import {TooltipProvider} from "@/components/ui/tooltip.tsx";
import Routes from "./routing.tsx"
import {AuthProvider} from "@/components/auth.tsx";
import {ErrorBoundary} from "@/components/error-boundary.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

if (import.meta.hot) {
    import.meta.hot.accept();
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30_000,
            gcTime: 5 * 60_000,
            refetchOnWindowFocus: false,
            retry: 1,
        },
        mutations: {
            retry: 0,
        },
    },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
    // <React.StrictMode>
    <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <AuthProvider>
                    <Routes/>
                </AuthProvider>
            </TooltipProvider>
        </QueryClientProvider>
    </ErrorBoundary>
    // </React.StrictMode>
)
