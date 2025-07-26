// Libraries
import Joi from 'joi'

const signUpSchema = Joi.object({
  username: Joi.string().min(4).max(16).required().messages({
    'any.required': 'Username is required',
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
      'any.required': 'Password is required',
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
      'any.required': 'Please confirm your password',
      'string.empty': 'Please confirm your password',
      'string.min': 'Must be at least 8 characters',
      'any.only': 'Passwords do not match'
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'any.required': 'Email is required',
      'string.empty': 'Email is required',
      'string.email': 'Email must be valid'
    }),
  otp: Joi.string().length(6).required().messages({
    'any.required': 'OTP is required',
    'string.empty': 'OTP is required',
    'string.length': 'OTP must be exactly 6 digits'
  })
})

export default signUpSchema
