import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Popup } from "./Popup";
import "./app.css";

const queryClient = new QueryClient();

const root = document.getElementById("root");
if (root) {
	createRoot(root).render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<Popup />
			</QueryClientProvider>
		</StrictMode>,
	);
}
