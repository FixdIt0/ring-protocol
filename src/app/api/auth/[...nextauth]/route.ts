import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

const handler = NextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.X_CLIENT_ID ?? "",
      clientSecret: process.env.X_CLIENT_SECRET ?? "",
      version: "2.0",
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.xId = (profile as any).data?.id ?? account.providerAccountId;
        token.xHandle = (profile as any).data?.username ?? (profile as any).username ?? "";
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).xId = token.xId;
      (session as any).xHandle = token.xHandle;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
