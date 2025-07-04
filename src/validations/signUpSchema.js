// Libraries
import Joi from 'joi'

const signUpSchema = Joi.object({
  username: Joi.string().min(4).max(16).required().messages({
    'string.empty': 'Username is required',
    'string.min': 'Must be at least 4 characters'
  }),
  password: Joi.string()
    .min(8)
    .max(16)
    .pattern(/[a-z]/, 'lowercase letter')
    .pattern(/[A-Z]/, 'uppercase letter')
    .pattern(/[0-9]/, 'number')
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Must be at least 8 characters',
      'string.pattern.name': 'Must include at least one {#name}'
    }),
  rePassword: Joi.string()
    .min(8)
    .required()
    .custom((value, helpers) => {
      if (!value) return helpers.error('string.empty')
      if (value !== helpers.state.ancestors[0].password) return helpers.error('any.only')
      return value
    })
    .messages({
      'string.empty': 'Please confirm your password',
      'string.min': 'Must be at least 8 characters',
      'any.only': 'Passwords do not match'
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Email must be valid'
    })
})

export default signUpSchema
