import {
    boolean,
    timestamp,
    pgTable,
    pgEnum,
    text,
    serial,
    primaryKey,
    integer,
  } from "drizzle-orm/pg-core"
import { createId } from "@paralleldrive/cuid2"
import type { AdapterAccountType } from "next-auth/adapters"

export const RoleEnum = pgEnum("role", ["user", "admin"])

export const posts = pgTable('posts', {
    id: serial('id').primaryKey().notNull(),
    title: text('title').notNull(),
})

export const users = pgTable("user", {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => createId()),
    password: text("password"),
    name: text("name"),
    email: text("email").unique().notNull(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    twoFactorEnabled: boolean("twoFactorEnabled").default(false),
    role: RoleEnum("role").default("user")
  })
   
  export const accounts = pgTable(
    "account",
    {
      userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
      type: text("type").$type<AdapterAccountType>().notNull(),
      provider: text("provider").notNull(),
      providerAccountId: text("providerAccountId").notNull(),
      refresh_token: text("refresh_token"),
      access_token: text("access_token"),
      expires_at: integer("expires_at"),
      token_type: text("token_type"),
      scope: text("scope"),
      id_token: text("id_token"),
      session_state: text("session_state"),
    },
    (account) => [
      {
        compoundKey: primaryKey({
          columns: [account.provider, account.providerAccountId],
        }),
      },
    ]
  )

  export const emailTokens = pgTable(
    "verification_token",
    {
      id: text("id").notNull().$defaultFn(() => createId()),
      token: text("token").notNull(),
      expires: timestamp("expires", { mode: "date" }).notNull(),
      email: text("email").notNull(),
    },
    (vt: { id: any; token: any }) => ({
      compoundKey: primaryKey({ columns: [vt.id, vt.token] }),
    })
  )

  export const passwordResetTokens = pgTable(
    "password_reset_tokens",
    {
      id: text("id").notNull().$defaultFn(() => createId()),
      token: text("token").notNull(),
      expires: timestamp("expires", { mode: "date" }).notNull(),
      email: text("email").notNull(),
    },
    (vt: { id: any; token: any }) => ({
      compoundKey: primaryKey({ columns: [vt.id, vt.token] }),
    })
  )

  export const twoFactorTokens = pgTable(
    "two_factor_tokens",
    {
      id: text("id").notNull().$defaultFn(() => createId()),
      token: text("token").notNull(),
      expires: timestamp("expires", { mode: "date" }).notNull(),
      email: text("email").notNull(),
    },
    (vt: { id: any; token: any }) => ({
      compoundKey: primaryKey({ columns: [vt.id, vt.token] }),
    })
  )