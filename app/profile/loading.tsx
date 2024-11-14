// components/ProfilePageLoading.js
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function Loading() {
    return (
        <div className='max-w-2xl mx-auto w-full h-[80%]'>
            <h1 className='text-3xl m-4'>User Profile</h1>
            <div className='flex flex-col w-full bg-gray-100 rounded p-4'>
                <div className='flex justify-between items-center p-4'>
                    <Skeleton circle={true} height={64} width={64} /> {/* Profile Image */}
                    <Skeleton width={120} height={28} /> {/* Name */}
                </div>
                <div className="p-4">
                    <Skeleton width={180} height={20} /> {/* Email */}
                </div>

                <h2 className='my-4 text-3xl'>Current Program</h2>
                
                <Skeleton height={100} width="100%" /> {/* ProgramTab */}
            </div>
        </div>
    );
}