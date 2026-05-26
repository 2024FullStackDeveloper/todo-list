import crypto from 'crypto';

export function generateSecretCode(length: number = 32): string {
    const secret = crypto.randomBytes(length).toString('hex');
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║               YOUR SECURE GENERATED SECRET                 ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log(secret);
    console.log('══════════════════════════════════════════════════════════════\n');
    return secret;
}


generateSecretCode();