
import Link from 'next/link'

export default function ProgramTab({name, length, days, id, userProgramId}) {

    return (
            <div className={`w-3xl ${id === userProgramId ? 'bg-green-100': 'bg-gray-200'} p-4 relative`}>
              <div className='w-[100%] flex justify-between space-x-16 p-2'>
                  <div>
                      <h2 className="text-xl">{name}</h2>
                      <p className="font-sm opacity-50">{length} Weeks - {days} Days / Week</p>
                  </div>
                  <div className='flex flex-col space-y-4'>
                    <Link href={`/programs/${id}`}><button>View Program</button></Link>
                    {id === userProgramId && <Link href={'/'}><button>Next Workout</button></Link>}
                  </div>
              </div>
            </div>
    )

}