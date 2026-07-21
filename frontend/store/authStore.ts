import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

interface UserPayload {
    sub: string;
    email: string;
    role: string;
    role_id: number;
}

interface AuthStore {
    token: string | null;
    user: UserPayload | null;

    setToken: (token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    token: null,
    user: null,

    setToken: (token: string) => {
        const user = jwtDecode<UserPayload>(token);

        set({
            token,
            user,
        });
    },

    logout: () =>
        set({
            token: null,
            user: null,
        }),
}));