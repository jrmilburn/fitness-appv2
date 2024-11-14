import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function Loading() {
    return (
        <div className='max-w-2xl mx-auto w-full h-[80%]'>
            <h1 className='text-3xl m-4'>Settings</h1>
            <div className='flex flex-col w-full bg-gray-100 rounded p-4'>
                <div className='flex justify-between items-center p-4'>
                    <Skeleton width={120} height={28} /> {/* Name */}
                    <Skeleton circle={true} height={64} width={64} /> {/* Profile Image */}
                </div>

                <div className="flex flex-col space-y-6 w-[60%] mx-auto">
                    {/* Bodyweight Input */}
                    <div className="flex justify-around items-center">
                        <Skeleton width={80} height={20} /> {/* Label */}
                        <Skeleton width={100} height={36} /> {/* Input */}
                    </div>

                    {/* Username Input */}
                    <div className="flex justify-around items-center">
                        <Skeleton width={80} height={20} /> {/* Label */}
                        <Skeleton width={100} height={36} /> {/* Input */}
                    </div>

                    {/* Save Button */}
                    <Skeleton width={100} height={40} />
                </div>
            </div>
        </div>
    );
}