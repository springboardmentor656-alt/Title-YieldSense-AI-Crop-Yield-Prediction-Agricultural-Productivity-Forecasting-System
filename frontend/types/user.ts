export type UserRole =
    | "Administrator"
    | "Farmer"
    | "Agriculture Department"
    | "Agri Consultant"
    | "Researcher";

export const USER_ROLES: UserRole[] = [
    "Administrator",
    "Farmer",
    "Agriculture Department",
    "Agri Consultant",
    "Researcher",
];

export interface User {
    id: number;
    full_name: string;
    email: string;
    role: UserRole | string;
    is_active: boolean;
}
