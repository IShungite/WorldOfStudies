import vine from '@vinejs/vine'

export const registerUserValidator = vine.compile(
  vine.object({
    firstName: vine.string().trim(),
    lastName: vine.string().trim(),
    email: vine
      .string()
      .trim()
      .email()
      .unique(async (db, value) => {
        const user = await db.query().from('users').where('email', value).limit(1).exec()
        return user.length === 0
      }),
    password: vine.string().trim(),
  })
)
