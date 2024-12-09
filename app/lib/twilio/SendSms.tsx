import twilio from 'twilio';
import { prisma } from '../prisma';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

const client = twilio(accountSid, authToken);

/**
 * Sends a verification code to the provided phone number.
 * @param {string} phoneNumber - The recipient's phone number (e.g., '0412337616').
 * @returns {Promise<void>}
 */
export async function SendSms(phoneNumber) {
    try {
        // Parse and validate the phone number
        const parsedNumber = parsePhoneNumberFromString(phoneNumber, 'AU'); // Replace 'AU' with your default country
        if (!parsedNumber || !parsedNumber.isValid()) {
            throw new Error('Invalid phone number');
        }

        const verification = await client.verify.v2.services(verifyServiceSid).verifications.create({
            to: parsedNumber.format('E.164'), // Ensure the number is in E.164 format
            channel: 'sms',
        });

        if (process.env.NODE_ENV !== 'production') {
            console.log(`Verification code sent: ${verification.sid}`);
        }
        return verification;
    } catch (error) {
        console.error(`Failed to send SMS: ${error.message}`);
        throw new Error('Could not send SMS');
    }
}

/**
 * Verifies the OTP sent to the user's phone number.
 * @param {string} phoneNumber - The recipient's phone number (e.g., '+1234567890').
 * @param {string} code - The OTP entered by the user.
 * @returns {Promise<boolean>} - Returns true if the OTP is valid, otherwise false.
 */
export async function verifyOtp(email, code) {
    try {

        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        const parsedNumber = parsePhoneNumberFromString(user.phone, 'AU'); // Replace 'AU' with your default country
        if (!parsedNumber || !parsedNumber.isValid()) {
            throw new Error('Invalid phone number');
        }

        const verificationCheck = await client.verify.v2.services(verifyServiceSid).verificationChecks.create({
            to: parsedNumber.format('E.164'),
            code,
        });
        return verificationCheck.status === 'approved';
    } catch (error) {
        console.error(`OTP verification failed: ${error.message}`);
        return false;
    }
}