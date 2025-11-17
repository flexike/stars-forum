import { t } from "elysia";

export type User = {
    id: number;
    username: string;
    passwordHash: string;
    nickname: string;
    role: keyof typeof UserRole;
    posts: number[];
}

export enum UserRole {
    user = "user",
    admin = "admin",
    moderator = "moderator",
}

export type PublicUser = Omit<User, 'passwordHash'>

export const postCreateNewUserInput = t.Object({
    username: t.String({minLength: 5 }),
    password: t.String(),
    nickname: t.String(),
    role: t.Optional(t.Enum(UserRole))
})

export type CreateNewUserInput = typeof postCreateNewUserInput['static']