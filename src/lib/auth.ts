import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";

import { env } from "@/env.mjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials, req) {
        try {
          const siwe = new SiweMessage(JSON.parse(credentials?.message || "{}"));
          const nextAuthUrl = new URL(env.NEXTAUTH_URL || "");

          const result = await siwe.verify({
            signature: credentials?.signature || "",
            domain: nextAuthUrl.host,
            nonce: await getCsrfToken({ req }),
          });

          // console.log("SIWE address: ", siwe.address);

          if (result.success) {
            // Create user if not exists
            const user = await prisma.user.upsert({
              where: {
                address: siwe.address,
              },
              create: {
                address: siwe.address,
              },
              update: {},
            });

            // console.log("User 1: ", user);

            return {
              id: user.id,
              address: siwe.address,
            };
          }

          // console.log("Here");

          return null;
        } catch (e) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      // console.log("Token 2: ", token);
      // console.log("Session: ", session);
      session.user = {
        ...token,
        address: token.address,
      };
      // session.address = token.address;
      return session;
    },
    async jwt({ token, user }) {
      // console.log("Token 1 : ", token);
      // console.log("User 2: ", user);
      const dbUser = await prisma.user.findFirst({
        where: {
          id: user?.id || token.id,
        },
      });

      // console.log("DB User 1: ", dbUser);

      if (!dbUser) {
        if (user) {
          token.id = user?.id;
        }
        return token;
      }

      return {
        id: dbUser.id,
        address: dbUser.address,
      };
    },
  },
};
