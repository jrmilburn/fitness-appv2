// components/PremiumDetails.tsx

import { User, Subscription } from '@prisma/client';
import { format } from 'date-fns';
import { FaStar } from 'react-icons/fa';

interface PremiumDetailsProps {
    user: User & { subscription: Subscription | null };
}

const PremiumDetails: React.FC<PremiumDetailsProps> = ({ user }) => {
    const { subscription } = user;

    return (
        <div className="bg-green-50 dark:bg-green-900 p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
                <FaStar className="text-yellow-400 w-6 h-6 mr-2" />
                <h2 className="text-2xl font-semibold text-green-700 dark:text-green-300">Premium Membership</h2>
            </div>
            <p className="text-green-600 dark:text-green-200 mb-2">Thank you for being a Premium member!</p>
            {/* Display Subscription Details */}
            <div className="mt-4">
                <h3 className="text-xl font-medium text-green-700 dark:text-green-300">Subscription Details:</h3>
                <ul className="list-disc list-inside mt-2 text-green-600 dark:text-green-200">
                    <li><strong>Plan:</strong> {subscription?.plan ?? 'N/A'}</li>
                    <li><strong>Status:</strong> {subscription?.status ?? 'N/A'}</li>
                    <li><strong>Renewal Date:</strong> {subscription?.currentPeriodEnd ? format(new Date(subscription.currentPeriodEnd), 'PPP') : 'N/A'}</li>
                    {/* Add more details as needed */}
                </ul>
            </div>
            {/* Optionally, add a button to manage subscription */}
            <div className="mt-6">
                <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400">
                    Manage Subscription
                </button>
            </div>
        </div>
    );
}

export default PremiumDetails;
