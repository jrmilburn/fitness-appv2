import RadioBtn from "../Radiobtn";
import { useState, useEffect } from 'react';

export default function AutoRegulationForm({setSubmission}) {

    const [soreness, setSoreness] = useState(null);
    const [jointpain, setJointPain] = useState(null);
    const [workload, setWorkload] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false);

    const handleSubmit = () => {
        setSubmission(true);
    }

    const onChange = () => {

    }

    useEffect(() => {
        setIsFormValid(soreness !== '' && jointpain !== null && workload !== null);
    }, [soreness, jointpain, workload]);

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-background rounded-lg shadow-lg flex flex-col items-center">
            <form onSubmit={handleSubmit} className="w-full p-4 sm:p-8 bg-background sm:shadow-md rounded-lg mx-auto max-w-screen-sm sm:border-2">
            <h2 className="text-3xl inter-bold text-primary-text mb-6">General Details</h2>

            <div className="flex flex-col space-y-6 w-full">

                <div>
                    <h3 className="text-lg inter-bold text-primary-text mb-2">Soreness after last session</h3>
                    <div className="flex space-x-4">
                        <RadioBtn id="soreness1" name="soreness" text="Never got sore" onChange={() => setSoreness(0)} checked={soreness === 0} size={2}/>
                        <RadioBtn id="soreness2" name="soreness" text="Sore But Recovered" onChange={() => setSoreness(1)} checked={soreness === 1} size={2}/>
                        <RadioBtn id="soreness3" name="soreness" text="Still Sore" onChange={() => setSoreness(2)} checked={soreness === 2} size={2}/>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg inter-bold text-primary-text mb-2">Joint pain today</h3>
                    <div className="flex space-x-4">
                        <RadioBtn id="jointpaint1" name="jointpain" text="None" onChange={() => setJointPain(0)} checked={jointpain === 0} size={2}/>
                        <RadioBtn id="jointpaint2" name="jointpain" text="Some" onChange={() => setJointPain(1)} checked={jointpain === 1} size={2}/>
                        <RadioBtn id="jointpaint3" name="jointpain" text="Alot" onChange={() => setJointPain(2)} checked={jointpain === 2} size={2}/>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg inter-bold text-primary-text mb-2">Workload today</h3>
                    <div className="flex space-x-4">
                        <RadioBtn id="workload1" name="workload" text="Easy" onChange={() => setWorkload(0)} checked={workload === 0} size={2}/>
                        <RadioBtn id="workload2" name="workload" text="Challenging" onChange={() => setWorkload(1)} checked={workload === 1} size={2}/>
                        <RadioBtn id="workload3" name="workload" text="Too much" onChange={() => setWorkload(2)} checked={workload === 2} size={2}/>
                    </div>
                </div>

                <button
                    type="submit"
                    className={`p-4 rounded-lg text-primary-text font-semibold ${isFormValid ? 'bg-black hover:bg-primary-text text-background' : 'bg-gray-400 cursor-not-allowed'}`}
                    disabled={!isFormValid}
                >
                    Submit
                </button>
            </div>
        </form>
            </div>
        </div>
    )

}