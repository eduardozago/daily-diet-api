import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { error } from 'console'

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const { sessionId } = request.cookies

    if (sessionId) {
      const createMealsBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        in_diet: z.boolean(),
      })

      const { name, description, in_diet } = createMealsBodySchema.parse(
        request.body,
      )

      const [{ id: userId }] = await knex('users')
        .select('id')
        .where('session_id', sessionId)

      if (userId) {
        await knex('meals').insert({
          id: crypto.randomUUID(),
          user_id: userId,
          name,
          description,
          in_diet,
        })

        return reply.status(201).send()
      } else {
        return reply.status(400).send()
      }
    } else {
      return reply.status(401).send({
        error: 'Unauthorized',
      })
    }
  })

  app.get('/', async () => {
    const meals = await knex('meals').select('*')

    return meals
  })
}
