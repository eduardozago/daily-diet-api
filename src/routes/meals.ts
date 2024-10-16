import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const createMealsBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        in_diet: z.boolean(),
      })

      const { name, description, in_diet } = createMealsBodySchema.parse(
        request.body,
      )

      const userId = request.body.userId

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
    },
  )

  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const userId = request.body.userId

      const meals = await knex('meals').select('*').where('user_id', userId)

      return meals
    },
  )
}
