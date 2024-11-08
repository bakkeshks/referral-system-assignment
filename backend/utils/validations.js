const { z } = require("zod");

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(4),
  referralCode: z.string().max(6).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

module.exports = { registerSchema, loginSchema };
