import { getAddressFromPublicKey } from '@solana/addresses';
import { generateKeyPair, signBytes } from '@solana/keys';
import { CompilableTransaction, ITransactionWithSignatures, signTransaction } from '@solana/transactions';

import { MessageSigner, SignedMessageResponse } from './message-signer';
import { TransactionSigner } from './transaction-signer';

export async function createSignerFromKeypair(keypair: CryptoKeyPair): Promise<MessageSigner & TransactionSigner> {
    return {
        address: await getAddressFromPublicKey(keypair.publicKey),
        signMessage: async (messages: ReadonlyArray<Uint8Array>): Promise<ReadonlyArray<SignedMessageResponse>> => {
            return Promise.all(
                messages.map(async message => ({
                    signature: await signBytes(keypair.privateKey, message),
                    signedMessage: message,
                }))
            );
        },
        signTransaction: async <TTransaction extends CompilableTransaction>(
            transactions: ReadonlyArray<TTransaction>
        ): Promise<ReadonlyArray<TTransaction & ITransactionWithSignatures>> => {
            return transactions.reduce(async (previousPromise, transaction) => {
                const previousTransactions = await previousPromise;
                return [...previousTransactions, await signTransaction<TTransaction>([keypair], transaction)];
            }, Promise.resolve([] as Array<TTransaction & ITransactionWithSignatures>));
        },
    };
}

export async function generateKeypairSigner(): Promise<MessageSigner & TransactionSigner> {
    return createSignerFromKeypair(await generateKeyPair());
}
