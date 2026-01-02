import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),

    session: {
        strategy: "jwt",
    },

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true,
        }),

        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true,
        }),

        CredentialsProvider({
            id: "credentials", // 👈 explicit
            name: "Credentials",
            credentials: {},
            async authorize() {
                // 🔒 TEMPORARY hardcoded user (NO Prisma)
                return {
                    id: "demo-user-id",
                    email: "demo@example.com",
                    name: "Demo User",
                };
            },
        }),
    ],

    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
