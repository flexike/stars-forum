import type { User } from "../types/user";

export const mockUsers: User[] = [
  {
    id: 1,
    username: "admin",
    passwordHash: "temp-admin-password",
    nickname: "Admin",
    role: "admin",
  },
  {
    id: 2,
    username: "kael",
    passwordHash: "temp-kael-password",
    nickname: "Kael",
    role: "user",
  },
];
