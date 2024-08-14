import create from 'zustand';
import { persist } from 'zustand/middleware';
import api, { setAuthToken } from '../api';
import { AppState, User } from '../types';

const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            darkMode: false,
            setUser: (user) => set({ user }),
            setToken: (token) => set({ token }),
            login: (user, token) => {
                set({ user, token });
                setAuthToken(token);
                localStorage.setItem('token', token);
            },
            logout: () => {
                set({ user: null, token: null });
                setAuthToken('');
                localStorage.removeItem('token');
            },
            // checkAuth: async () => {
            //     const token = get().token || localStorage.getItem('token');
            //     if (token) {
            //         try {
            //             setAuthToken(token);
            //             const response = await api.get<User>('/auth/me');
            //             set({ user: response.data, token });
            //         } catch (error) {
            //             console.error('Error fetching user data:', error);
            //             get().logout();
            //         }
            //     }
            // },
            checkAuth: async () => {
                const token = localStorage.getItem('token');
                if (token) {
                    try {
                        setAuthToken(token);
                        const response = await api.get<User>('/auth/me');
                        set({ user: response.data, token });
                    } catch (error) {
                        console.error('Error fetching user data:', error);
                        get().logout();
                    }
                }
            },
            toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
        }),
        {
            name: 'app-storage',
            getStorage: () => localStorage,
        }
    )
);

export default useAppStore;