// Firebase Configuration
// This module handles the initialization of Firebase.
// It attempts to read configuration from global variables injected by the environment.

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {
    getFirestore,
    collection,
    addDoc,
    query,
    where,
    onSnapshot,
    serverTimestamp,
    setLogLevel
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Configuration variables (provided by Canvas environment or fallback)
const appId = typeof window.__app_id !== 'undefined' ? window.__app_id : 'default-app-id';
let firebaseConfig;

try {
    if (typeof window.__firebase_config !== 'undefined') {
        firebaseConfig = JSON.parse(window.__firebase_config);
    } else {
        console.warn("No __firebase_config found. Using empty config.");
        firebaseConfig = {};
    }
} catch (e) {
    console.error("Error parsing firebase config:", e);
    firebaseConfig = {};
}

const initialAuthToken = typeof window.__initial_auth_token !== 'undefined' ? window.__initial_auth_token : null;

export const ACCOUNT_ID = 'Allmer Bank';
export const LEDGER_PATH = `artifacts/${appId}/public/data/ledger_entries`;

let db;
let auth;
let userId;
let isAuthReady = false;

// Event system for auth ready
const authReadyEvent = new Event('authReady');

export function initializeFirebase() {
    try {
        setLogLevel('debug');
        console.log("Firestore logging level set to DEBUG.");

        if (Object.keys(firebaseConfig).length === 0) {
            console.warn("Firebase config is empty. Skipping initialization.");
            return;
        }

        const app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);

        listenForAuthAndData();

        if (initialAuthToken) {
            signInWithCustomToken(auth, initialAuthToken).catch(e => console.error("Custom token sign-in failed:", e));
        } else {
            signInAnonymously(auth).catch(e => console.error("Anonymous sign-in failed:", e));
        }

        console.log("Firebase initialized. Waiting for authentication state.");
    } catch (error) {
        console.error("Error during Firebase initialization:", error);
        const ledgerEl = document.getElementById('ledger-loading');
        if (ledgerEl) ledgerEl.textContent = 'Error loading financial data.';
    }
}

function listenForAuthAndData() {
    let initialCheckComplete = false;

    onAuthStateChanged(auth, (user) => {
        if (user && !isAuthReady) {
            userId = user.uid;
            isAuthReady = true;
            console.log("Auth state confirmed via listener. User ID:", userId);

            window.dispatchEvent(authReadyEvent);
            initialCheckComplete = true;

        } else if (!user && !initialCheckComplete) {
            console.log("Waiting for user authentication state...");
            if (!userId) {
                userId = crypto.randomUUID();
            }
        }
    }, (error) => {
        console.error("Error during authentication state change:", error);
    });
}

export function getDb() {
    return db;
}

export function getIsAuthReady() {
    return isAuthReady;
}

export function getUserId() {
    return userId;
}

export {
    collection,
    addDoc,
    query,
    where,
    onSnapshot,
    serverTimestamp
};
