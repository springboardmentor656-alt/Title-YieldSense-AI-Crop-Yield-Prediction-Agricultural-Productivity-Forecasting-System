import { z } from "zod";

export const loginSchema = z.object({

    email: z.string().email(),

    password: z.string().min(6),

});

export type LoginSchemaType = z.infer<typeof loginSchema>;

export const registerSchema = z.object({

    full_name: z.string().min(3),

    email: z.string().email(),

    password: z.string().min(6),

    role: z.string(),

});

export type RegisterSchemaType =

    z.infer<typeof registerSchema>;