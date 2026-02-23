import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.scss";
import "./tailwind.css";
import App from "./app/App.jsx";
import { AuthProvider } from './context/AuthContext.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<AuthProvider>
			<BrowserRouter>
				<GoogleOAuthProvider clientId={CLIENT_ID}>
					<App />
				</GoogleOAuthProvider>
			</BrowserRouter>
		</AuthProvider>
	</StrictMode>
);
