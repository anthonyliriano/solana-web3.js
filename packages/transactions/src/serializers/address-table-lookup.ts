import { getAddressCodec, getAddressDecoder, getAddressEncoder } from '@solana/addresses';
import type { Codec, Decoder, Encoder } from '@solana/codecs-core';
import {
    getArrayCodec,
    getArrayDecoder,
    getArrayEncoder,
    getStructCodec,
    getStructDecoder,
    getStructEncoder,
} from '@solana/codecs-data-structures';
import {
    getShortU16Codec,
    getShortU16Decoder,
    getShortU16Encoder,
    getU8Codec,
    getU8Decoder,
    getU8Encoder,
} from '@solana/codecs-numbers';

import type { getCompiledAddressTableLookups } from '../compile-address-table-lookups';

type AddressTableLookup = ReturnType<typeof getCompiledAddressTableLookups>[number];

const lookupTableAddressDescription = __DEV__
    ? 'The address of the address lookup table account from which instruction addresses should be looked up'
    : 'lookupTableAddress';

const writableIndicesDescription = __DEV__
    ? 'The indices of the accounts in the lookup table that should be loaded as writeable'
    : 'writableIndices';

const readableIndicesDescription = __DEV__
    ? 'The indices of the accounts in the lookup table that should be loaded as read-only'
    : 'readableIndices';

let memoizedArrayU8Encoder: Encoder<readonly number[]> | undefined;
function getMemoizedArrayU8Encoder(): Encoder<readonly number[]> {
    if (!memoizedArrayU8Encoder)
        memoizedArrayU8Encoder = getArrayEncoder(getU8Encoder(), {
            size: getShortU16Encoder(),
        }) as Encoder<readonly number[]>;
    return memoizedArrayU8Encoder;
}

function getMemoizedArrayU8EncoderDescription(description: string): Encoder<readonly number[]> {
    const encoder = getMemoizedArrayU8Encoder();
    return {
        ...encoder,
        description,
    };
}

let memoizedArrayU8Decoder: Decoder<readonly number[]> | undefined;
function getMemoizedArrayU8Decoder(): Decoder<readonly number[]> {
    if (!memoizedArrayU8Decoder)
        memoizedArrayU8Decoder = getArrayDecoder(getU8Decoder(), {
            size: getShortU16Decoder(),
        }) as Decoder<readonly number[]>;
    return memoizedArrayU8Decoder;
}

function getMemoizedArrayU8DecoderDescription(description: string): Decoder<readonly number[]> {
    const decoder = getMemoizedArrayU8Decoder();
    return {
        ...decoder,
        description,
    };
}

let memoizedArrayU8Codec: Codec<readonly number[]> | undefined;
function getMemoizedArrayU8Codec(): Codec<readonly number[]> {
    if (!memoizedArrayU8Codec)
        memoizedArrayU8Codec = getArrayCodec(getU8Codec(), {
            size: getShortU16Codec(),
        }) as unknown as Codec<readonly number[]>;
    return memoizedArrayU8Codec;
}

function getMemoizedArrayU8CodecDescription(description: string): Codec<readonly number[]> {
    const codec = getMemoizedArrayU8Codec();
    return {
        ...codec,
        description,
    };
}

export function getAddressTableLookupEncoder(): Encoder<AddressTableLookup> {
    return getStructEncoder(
        [
            [
                'lookupTableAddress',
                {
                    ...getAddressEncoder(),
                    description: lookupTableAddressDescription,
                },
            ],
            ['writableIndices', getMemoizedArrayU8EncoderDescription(writableIndicesDescription)],
            ['readableIndices', getMemoizedArrayU8EncoderDescription(readableIndicesDescription)],
        ],
        __DEV__
            ? {
                  description:
                      'A pointer to the address of an address lookup table, along with the ' +
                      'readonly/writeable indices of the addresses that should be loaded from it',
              }
            : undefined
    );
}

export function getAddressTableLookupDecoder(): Decoder<AddressTableLookup> {
    return getStructDecoder(
        [
            [
                'lookupTableAddress',
                {
                    ...getAddressDecoder(),
                    description: lookupTableAddressDescription,
                },
            ],
            ['writableIndices', getMemoizedArrayU8DecoderDescription(writableIndicesDescription)],
            ['readableIndices', getMemoizedArrayU8DecoderDescription(readableIndicesDescription)],
        ],
        __DEV__
            ? {
                  description:
                      'A pointer to the address of an address lookup table, along with the ' +
                      'readonly/writeable indices of the addresses that should be loaded from it',
              }
            : undefined
    );
}

export function getAddressTableLookupCodec(): Codec<AddressTableLookup> {
    return getStructCodec(
        [
            [
                'lookupTableAddress',
                {
                    ...getAddressCodec(),
                    description: lookupTableAddressDescription,
                },
            ],
            ['writableIndices', getMemoizedArrayU8CodecDescription(writableIndicesDescription)],
            ['readableIndices', getMemoizedArrayU8CodecDescription(readableIndicesDescription)],
        ],
        __DEV__
            ? {
                  description:
                      'A pointer to the address of an address lookup table, along with the ' +
                      'readonly/writeable indices of the addresses that should be loaded from it',
              }
            : undefined
    );
}
