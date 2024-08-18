import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setAuthToken } from '../api';
import { AppState } from '../types';

const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            darkMode: true,
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
            checkAuth: async () => {
                const token = localStorage.getItem('token');
                if (token) {
                    try {
                        setAuthToken(token);
                        // const response = await api.get<User>('/auth/me');
                        // set({ user: response.data, token });
                        // get().setUser(response.data);
                        // @ts-ignore
                        // set({ user: response.data.user })
                        // console.log(response.data);
                        // console.log(localStorage.getItem('user'));
                        // useAppStore.setState({ user: response.data, token });
                        // set({ user: response.data });
                        // console.log('Updated user:', get().user);
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