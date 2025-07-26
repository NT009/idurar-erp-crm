import z from "zod";

export const projectCreateValidator = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  status: z.enum(["pending", "in-progress", "completed"]).optional(),
});
export const projectUpdateValidator = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(["pending", "in-progress", "completed"]).optional(),
  removed: z.boolean().optional(),
});