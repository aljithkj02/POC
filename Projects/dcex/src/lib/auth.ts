import db from '@/db';
import { Provider } from '@prisma/client';
import { Keypair } from '@solana/web3.js';
import GoogleProvider from "next-auth/providers/google";

import { Session } from 'next-auth';

export interface ISession extends Session {
    user: {
        uid: string;
        email: string;
        name: string;
        image: string;
    }
}

export const authConfig = {
    secret: process.env.NEXTAUTH_SECRET || 'secr3t',
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        })
    ],
    callbacks: {
        session: ({ session, token }: any): ISession => {
            const newSession: ISession = session as ISession;
            
            if (newSession.user && token.uid) {
                newSession.user.uid = token.uid ?? "";
            }

            return newSession;
        },
        async jwt({ token, account, profile }: any) {
            const user = await db.user.findFirst({
                where: {
                    sub: account?.providerAccountId ?? ""
                }
            })

            if (user) {
                token.uid = user.id;
            }
            
            return token;
        },
        async signIn({ user, account }: any) {
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
                
                await db.user.create({
                    data: {
                        username: user.name,
                        email: user.email,
                        profilePicture: user.image,
                        provider: Provider.Google,
                        sub: account.providerAccountId,
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

                return true;
            }
            
            return false;
        }
    }
}