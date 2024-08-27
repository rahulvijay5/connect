import * as z from "zod";

export const UsernameSchema = z.object({
  username: z
    .string()
    .min(4, { message: "Username must be at least 4 characters long" })
    .max(20, { message: "Username cannot exceed 20 characters" })
    .regex(/^[a-z][a-z0-9_]*[a-z0-9]$/, {
      message:
        "Username can only contain alphabets, digits, and underscores, and cannot start or end with an underscore",
    }),
});

// export const UserSchema = z.object({
//   given_name: z
//     .string()
//     .min(2, { message: "Name should be of atleast 2 characters." }),
//   bio: z
//     .string()
//     .max(250, { message: "Bio should be lesser than 250 characters." }),
//   username: z.string(),
//   email:z.string().email(),
//   family_name: z.string(),
//   birthdate: z.string(),
//   profession: z.string(),
//   currentLocation: z.string(),
//   hometown: z.string(),

// });
