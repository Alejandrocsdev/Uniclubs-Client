// Libraries
import Joi from 'joi'

const recoverSchema = Joi.object({
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

export default recoverSchema
