
import Link from 'next/link'

export default function ProgramTab({name, length, days, id, userProgramId, created}) {

    return (
            <div className={`w-3xl ${id === userProgramId ? 'bg-green-100': 'bg-gray-200'} p-4 relative`}>
              <div className='w-[100%] flex justify-between space-x-16 p-2'>

                {userProgramId === null ? (
                  <>
                  <div>
                      <h2 className="text-xl">{name}</h2>
                      <p className="font-sm opacity-50">{name} has no current program</p>
                  </div>
                  <div className='flex flex-col space-y-4'>
                  </div>
                  </>
                ):(
                  <>
                  <div>
                      <h2 className="text-xl">{name}</h2>
                      <p className="font-sm opacity-50">{length} Weeks - {days} Days / Week</p>
                      <p className='font-sm opacity-50'>Created: {created}</p>
                  </div>
                  <div className='flex flex-col space-y-4 justify-center'>
                    <Link href={`/programs/${id}`}><button>View Program</button></Link>
                  </div>
                  </>
                )}

              </div>
            </div>
    )

}