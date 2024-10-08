import { pgEnum, pgTable, text, varchar, timestamp } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

export const userRoleEnum = pgEnum('user_role', ['manager', 'customer'])

export const users = pgTable('users', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  name: varchar('name').notNull(),
  email: varchar('email').notNull().unique(),
  phone: varchar('phone', {
    length: 12,
  }),
  role: userRoleEnum('role').default('customer').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
