// Libraries
import Joi from 'joi'

const signInSchema = Joi.object({
  username: Joi.string().required().messages({
    'any.required': 'Username is required',
    'string.empty': 'Username is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
    'string.empty': 'Password is required'
  })
})

export default signInSchema
