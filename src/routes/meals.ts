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

      const { userId } = request.body

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
      const { userId } = request.body

      const meals = await knex('meals').where('user_id', userId).select()

      return { meals }
    },
  )

  app.put(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const getMealsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const createMealsBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        in_diet: z.boolean(),
      })

      const { id } = getMealsParamsSchema.parse(request.params)

      const { name, description, in_diet } = createMealsBodySchema.parse(
        request.body,
      )

      const { userId } = request.body

      const meal = await knex('meals').where('user_id', userId).select()

      if (meal.length > 0) {
        await knex('meals')
          .update({
            name,
            description,
            in_diet,
          })
          .where('id', id)

        return reply.status(204).send()
      } else {
        return reply.status(400).send()
      }
    },
  )

  app.delete(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const getMealsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealsParamsSchema.parse(request.params)

      const { userId } = request.body

      const meal = await knex('meals').where('user_id', userId).select()

      if (meal.length > 0) {
        await knex('meals').delete().where('id', id)

        return reply.status(204).send()
      } else {
        return reply.status(400).send()
      }
    },
  )

  app.get(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const getMealsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealsParamsSchema.parse(request.params)

      const { userId } = request.body

      const meals = await knex('meals').where('user_id', userId).select()

      if (meals.length > 0) {
        const meal = await knex('meals').where('id', id).first()

        return { meal }
      } else {
        return reply.status(400).send()
      }
    },
  )

  app.get(
    '/total',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const { userId } = request.body

      const meals = await knex('meals').where('user_id', userId).select('*')

      const total = meals.length

      return { total }
    },
  )
}
