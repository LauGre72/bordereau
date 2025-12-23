import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { getFunctions } from 'firebase/functions'

const app = initializeApp({
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:import.meta.env.VITE_FIREBASE_PROJECT_ID,
})

export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()

export const loginWithGoogle = () => signInWithPopup(auth, provider)
export const logout = () => signOut(auth)

// init functions to ensure emulator/prod attach
getFunctions(app)
