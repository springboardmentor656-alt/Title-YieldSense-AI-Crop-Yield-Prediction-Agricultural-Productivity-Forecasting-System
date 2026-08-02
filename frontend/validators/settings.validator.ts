import { z } from "zod";

export const profileSchema = z.object({

    full_name: z.string().min(2, "Name must be at least 2 characters"),

    email: z.string().email("Enter a valid email address"),

});

export type ProfileSchemaType = z.infer<typeof profileSchema>;

export const passwordSchema = z.object({

    current_password: z.string().min(1, "Current password is required"),

    new_password: z.string().min(6, "New password must be at least 6 characters"),

    confirm_password: z.string().min(1, "Confirm your new password"),

}).refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
});

export type PasswordSchemaType = z.infer<typeof passwordSchema>;
