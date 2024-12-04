// components/StandardUserDetails.tsx

import EmbeddedCheckoutButton from '../Stripe/EmbeddedCheckoutForm';
import { FaRegStar } from "react-icons/fa";

export default function StandardUserDetails() {
    return (
        <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
                <FaRegStar className="text-yellow-300 w-6 h-6 mr-2" />
                <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-300">Standard Membership</h2>
            </div>
            <p className="text-blue-600 dark:text-blue-200 mb-4">
                Upgrade to Premium to unlock exclusive features and enjoy an ad-free experience!
            </p>
            <div className="flex justify-center">
                <EmbeddedCheckoutButton />
            </div>
        </div>
    );
}
