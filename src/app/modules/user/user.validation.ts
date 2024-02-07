import { z } from 'zod';

const userSchemaValidationSchema = z.object({
  password: z
    .string({
      invalid_type_error: 'Password must be string',
    })
    .min(6, { message: 'Password must be minimum 6 characters' })
    .max(20, { message: 'Passoword cant not be more than 20 characters' })
    .optional(),
});

export const UserValidation = {
  userSchemaValidationSchema,
};
