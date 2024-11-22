import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
 
export async function getUser(email: string): Promise<User | undefined> {
  try {
    if (!process.env.POSTGRES_URL || process.env.POSTGRES_URL === "mocked_connection_string") {
      console.log("Using mocked database connection. Returning mock user.");
      const mockUsers: User[] = [
        { id: "1", name: "Mock User", email: "mock@example.com", password: "123456" },
      ];
      return mockUsers.find((user) => user.email === email);
    }

    const result = await sql<User>`SELECT * FROM users WHERE email = ${email}`;
    return result.rows[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
        
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          console.log(user);
          console.log(user?.password);
          console.log(user?.email);
          if (!user) return null;
          // const passwordsMatch = await bcrypt.compare(password, user.password);
          //  if (passwordsMatch) {
              return user;
          // }
        }
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});

