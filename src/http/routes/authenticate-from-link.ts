import Elysia, { t } from 'elysia'
import { db } from '../../db/connection'
import dayjs from 'dayjs'
import { auth } from '../auth'
import { authLinks } from '../../db/schema'
import { eq } from 'drizzle-orm'

export const authenticateFromLink = new Elysia().use(auth).get(
  '/auth-links/authenticate',
  async ({ query, jwt, cookie: { auth }, redirect: elysiaRedirect }) => {
    const { code, redirect } = query
    const daysWhenLinkCreatedIsNotValid = 7

    const authLinkFromCode = await db.query.authLinks.findFirst({
      where(fields, { eq }) {
        return eq(fields.code, code)
      },
    })

    if (!authLinkFromCode) {
      throw new Error('Auth link not found')
    }

    const daysSinceAuthLinkWasCreated = dayjs().diff(
      authLinkFromCode.createdAt,
      'days',
    )

    if (daysSinceAuthLinkWasCreated > daysWhenLinkCreatedIsNotValid) {
      throw new Error('auth link expired, please generate a new one.')
    }

    const managedRestaurant = await db.query.restaurants.findFirst({
      where(fields, { eq }) {
        return eq(fields.managerId, authLinkFromCode.userId)
      },
    })

    const token = await jwt.sign({
      sub: authLinkFromCode.userId,
      restaurantId: managedRestaurant?.id,
    })

    auth.set({
      httpOnly: true, // cookie acessível apenas no backend, js clientside não consegue acessar nem o browser
      value: token,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/', // em quais rotas esse cookie vai ser acessível
    })

    await db.delete(authLinks).where(eq(authLinks.code, code))

    elysiaRedirect(redirect, 301)
  },
  {
    query: t.Object({
      code: t.String(),
      redirect: t.String(),
    }),
  },
)
