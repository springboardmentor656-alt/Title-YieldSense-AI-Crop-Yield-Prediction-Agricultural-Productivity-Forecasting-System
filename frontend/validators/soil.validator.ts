import { z } from "zod";

export const soilReportSchema = z.object({

    ph: z.number().min(0).max(14),

    nitrogen: z.number().min(0),

    phosphorus: z.number().min(0),

    potassium: z.number().min(0),

    moisture: z.number().min(0).max(100),

    organic_carbon: z.number().min(0),

});

export type SoilReportSchemaType =

    z.infer<typeof soilReportSchema>;
