import db from '@/db';
import { Provider } from '@prisma/client';
import { Keypair } from '@solana/web3.js';
import NextAuth from 'next-auth'
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === 'google') {
                if (!user.email || !user.name) {
                    return false;
                }

                const userDb = await db.user.findUnique({ where: { email: user.email }});

                if (userDb) {
                    return true;
                }

                const keyPair = Keypair.generate();
                const publicKey = keyPair.publicKey.toBase58();
                const privateKey = keyPair.secretKey.toString();

                console.log({
                    username: user.name,
                    email: user.email,
                    profilePicture: user.image,
                })

                try {
                    await db.user.create({
                        data: {
                            username: user.name,
                            email: user.email,
                            profilePicture: user.image,
                            provider: Provider.Google,
                            solWallet: {
                                create: {
                                    publicKey,
                                    privateKey
                                }
                            },
                            inrWallet: {
                                create: {
                                    balance: 0
                                }
                            }
                        }
                    }) 
                } catch (error) {
                    console.log((error as Error).message)
                }

                return true;
            }
            
            return false;
        }
    }
})
  
 export { handler as GET, handler as POST }