// Deno STD
export * as log from 'https://deno.land/std@0.160.0/log/mod.ts'
export { config } from 'https://deno.land/std@0.160.0/dotenv/mod.ts'

// AWS SIGN
export { AWSSignerV4 } from 'https://deno.land/x/aws_sign_v4@1.0.2/mod.ts'
export type { Credentials } from 'https://deno.land/x/aws_sign_v4@1.0.2/mod.ts'

// AWS SDK
export {
  STSClient,
  AssumeRoleCommand
} from 'https://deno.land/x/aws_sdk@v3.32.0-1/client-sts/mod.ts'
export type { 
  AssumeRoleCommandOutput 
} from 'https://deno.land/x/aws_sdk@v3.32.0-1/client-sts/mod.ts'

// Opine framework
export { opine } from 'https://deno.land/x/opine@2.3.3/mod.ts'
export type {
  OpineResponse,
  OpineRequest
} from 'https://deno.land/x/opine@2.3.3/mod.ts'
