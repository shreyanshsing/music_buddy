import Homepage from "@/components/Homepage";
import { SnackbarProvider } from "notistack";
import { Provider } from "react-redux";
import { persistor, store } from "@/store";
import type { AppProps } from 'next/app';
import { PersistGate } from "redux-persist/integration/react";

export default function MainShell({ Component, pageProps }: AppProps) {
    return (
        <SnackbarProvider maxSnack={3}>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <Component {...pageProps} />
                </PersistGate>
            </Provider>
        </SnackbarProvider>
    )    
}
