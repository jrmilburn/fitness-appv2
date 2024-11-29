import RadioBtn from "../Radiobtn";
import { useState, useEffect } from 'react';
import Loader from "../Loader";

export default function AutoRegulationForm({ setSubmission, id }) {
  const [soreness, setSoreness] = useState(null);
  const [jointpain, setJointPain] = useState(null);
  const [workload, setWorkload] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [show, setShow] = useState(false); // State to control transitions

  useEffect(() => {
    setShow(true); // Trigger the entry transition on mount
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/excercises/${id}/autoregulation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        soreness,
        jointpain,
        workload
      })
    });

    if (!response.ok) {
      setErr(true);
    }

    setIsLoading(false);
    setShow(false); // Trigger the exit transition
    setTimeout(() => {
      setSubmission(true); // Wait for the transition to finish before unmounting
    }, 300);
  };

  useEffect(() => {
    setIsFormValid(soreness !== null && jointpain !== null && workload !== null);
  }, [soreness, jointpain, workload]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ease-in-out ${show ? 'opacity-100' : 'opacity-0'}`}
    >
      <div
        className={`bg-background rounded-lg flex flex-col items-center transform transition-transform duration-300 ease-in-out ${show ? 'scale-100' : 'scale-95'}`}
      >
        <form onSubmit={handleSubmit} className="w-full p-6 sm:p-10 bg-background rounded-lg mx-auto max-w-screen-sm">
          {err && (
            <p className="text-red-400 mb-4">
              There was an error sending your request
            </p>
          )}
          <h2 className="text-2xl font-bold text-primary-text mb-6">General Details</h2>

          <div className="flex flex-col space-y-6 w-full">
            {/* Your form fields remain unchanged */}
            <div>
              <h3 className="text-xl font-semibold text-primary-text mb-2">Soreness after last session</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <RadioBtn id="soreness1" name="soreness" text="Never got sore" onChange={() => setSoreness(0)} checked={soreness === 0} size={2} />
                <RadioBtn id="soreness2" name="soreness" text="Sore But Recovered" onChange={() => setSoreness(1)} checked={soreness === 1} size={2} />
                <RadioBtn id="soreness3" name="soreness" text="Still Sore" onChange={() => setSoreness(2)} checked={soreness === 2} size={2} />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-primary-text mb-2">Joint pain today</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <RadioBtn id="jointpain1" name="jointpain" text="None" onChange={() => setJointPain(0)} checked={jointpain === 0} size={2} />
                <RadioBtn id="jointpain2" name="jointpain" text="Some" onChange={() => setJointPain(1)} checked={jointpain === 1} size={2} />
                <RadioBtn id="jointpain3" name="jointpain" text="A lot" onChange={() => setJointPain(2)} checked={jointpain === 2} size={2} />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-primary-text mb-2">Workload today</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <RadioBtn id="workload1" name="workload" text="Easy" onChange={() => setWorkload(0)} checked={workload === 0} size={2} />
                <RadioBtn id="workload2" name="workload" text="Pretty Good" onChange={() => setWorkload(1)} checked={workload === 1} size={2} />
                <RadioBtn id="workload3" name="workload" text="Challenging" onChange={() => setWorkload(2)} checked={workload === 2} size={2} />
                <RadioBtn id="workload4" name="workload" text="Too much" onChange={() => setWorkload(3)} checked={workload === 3} size={2} />
              </div>
            </div>

            <button
              type="submit"
              className={`flex justify-center items-center p-4 rounded-lg text-primary-text font-semibold text-lg ${
                isFormValid ? 'bg-black hover:bg-gray-800 text-background' : 'bg-gray-400 cursor-not-allowed'
              }`}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader size={6} color="white" />
                  <span className="ml-2">Submitting...</span>
                </>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
