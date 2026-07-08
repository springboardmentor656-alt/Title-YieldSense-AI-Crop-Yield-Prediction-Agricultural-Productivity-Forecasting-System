import { z } from "zod";

export const farmSchema = z.object({

    farm_name: z.string().min(3),

    latitude: z.number(),

    longitude: z.number(),

    area: z.number().positive(),

});

export type FarmSchemaType =

    z.infer<typeof farmSchema>;