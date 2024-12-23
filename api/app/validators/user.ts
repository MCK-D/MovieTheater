import vine from '@vinejs/vine'

export const LoginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(8),
  })
)

export const RegisterValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(8),
  })
)

export const RenameUserValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1),
  })
)

export const ChangePasswordValidator = vine.compile(
  vine.object({
    password: vine.string().minLength(8),
  })
)
