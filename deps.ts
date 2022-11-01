// Deno STD
export * as log from 'https://deno.land/std@0.161.0/log/mod.ts'
export { config } from 'https://deno.land/std@0.161.0/dotenv/mod.ts'
export type { DotenvConfig } from 'https://deno.land/std@0.161.0/dotenv/mod.ts'
export { crypto } from 'https://deno.land/std@0.161.0/crypto/mod.ts'
export {
  encode as base64encode,
  decode as base64decode
} from 'https://deno.land/std@0.161.0/encoding/base64url.ts'

// AWS SIGN
export { AWSSignerV4 } from 'https://deno.land/x/aws_sign_v4@1.0.2/mod.ts'
export type { Credentials } from 'https://deno.land/x/aws_sign_v4@1.0.2/mod.ts'

// AWS SDK
export {
  STSClient,
  AssumeRoleCommand
} from 'https://deno.land/x/aws_sdk@v3.32.0-1/client-sts/mod.ts'
export type { AssumeRoleCommandOutput } from 'https://deno.land/x/aws_sdk@v3.32.0-1/client-sts/mod.ts'

// Opine framework
export { opine } from 'https://deno.land/x/opine@2.3.3/mod.ts'
export type {
  OpineResponse,
  OpineRequest
} from 'https://deno.land/x/opine@2.3.3/mod.ts'

// Redis client
export { connect } from 'https://deno.land/x/redis/mod.ts'
export type { Redis } from 'https://deno.land/x/redis/mod.ts'
