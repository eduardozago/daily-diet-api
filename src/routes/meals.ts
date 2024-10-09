import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createMealsBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      in_diet: z.boolean(),
    })

    const { name, description, in_diet } = createMealsBodySchema.parse(
      request.body,
    )

    await knex('meals').insert({
      id: crypto.randomUUID(),
      name,
      description,
      in_diet,
    })

    return reply.status(201).send()
  })

  app.get('/', async () => {
    const meals = await knex('meals').select('*')

    return meals
  })
}
