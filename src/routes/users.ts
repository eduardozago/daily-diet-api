import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'

export async function usersRoutes(app: FastifyInstance) {
  // Create user route
  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string(),
    })

    const { name, email } = createUserBodySchema.parse(request.body)

    const sessionId = randomUUID()

    reply.cookie('sessionId', sessionId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    const user = await knex('users').select('*').where('email', email)

    if (user.length === 0) {
      await knex('users').insert({
        id: crypto.randomUUID(),
        name,
        email,
        session_id: sessionId,
      })

      return reply.status(201).send()
    } else {
      await knex('users').update('session_id', sessionId).where('email', email)
      return reply.status(204).send()
    }

    return reply.status(400).send()
  })

  app.get('/', async () => {
    const users = await knex('users').select('*')

    return users
  })
}
