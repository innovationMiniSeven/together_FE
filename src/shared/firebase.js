import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyD6NtPYPUWfSeMVj524IQ0NJtlnk_tC0rw',
  authDomain: 'heyyo-d84c2.firebaseapp.com',
  projectId: 'heyyo-d84c2',
  storageBucket: 'heyyo-d84c2.appspot.com',
  messagingSenderId: '979473057383',
  appId: '1:979473057383:web:6b4574aca76609cef576c2',
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export default app;
