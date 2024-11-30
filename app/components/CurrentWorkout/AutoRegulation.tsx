import RadioBtn from "../Radiobtn";
import { useState, useEffect } from 'react';
import Loader from "../Loader";
import { useMediaQuery } from 'react-responsive';

export default function AutoRegulationForm({ setSubmission, id, weekNo }) {
  const [soreness, setSoreness] = useState(null);
  const [jointpain, setJointPain] = useState(null);
  const [workload, setWorkload] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [show, setShow] = useState(false);

  // Determine if the screen is mobile
  const isMobile = useMediaQuery({ maxWidth: 640 }); // Tailwind's 'sm' breakpoint is 640px

  // Set radio button size based on screen size
  const radioSize = isMobile ? 1.75 : 2;

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
    // Adjust form validation based on weekNo
    if (weekNo === 1) {
      setIsFormValid(jointpain !== null && workload !== null);
    } else {
      setIsFormValid(soreness !== null && jointpain !== null && workload !== null);
    }
  }, [soreness, jointpain, workload, weekNo]);

  // Define class names based on isMobile
  const modalContentClassNames = isMobile
    ? `bg-background rounded-t-lg flex flex-col items-center transform w-full fixed top-16 left-0 right-0 bottom-0 transition-transform duration-300 ease-in-out ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`
    : `bg-background rounded-lg flex flex-col items-center transform w-full max-w-screen-sm transition-transform duration-300 ease-in-out ${
        show ? 'scale-100' : 'scale-95'
      }`;

  const overlayClassNames = `fixed inset-0 bg-black bg-opacity-50 z-50 ${
    show ? 'opacity-100' : 'opacity-0'
  } transition-opacity duration-300 ease-in-out`;

  return (
    <div className={overlayClassNames}>
      <div className={modalContentClassNames}>
        <form onSubmit={handleSubmit} className={`w-full p-6 sm:p-10 bg-background mx-auto ${isMobile ? 'rounded-t-lg' : 'rounded-lg'}`}>
          {err && (
            <p className="text-red-400 mb-4">
              There was an error sending your request
            </p>
          )}
          <h2 className="text-2xl font-bold text-primary-text mb-6">General Details</h2>

          <div className="flex flex-col space-y-6 w-full">
            {/* Conditionally render the soreness question */}
            {weekNo !== 1 && (
              <div>
                <h3 className="text-xl font-semibold text-primary-text mb-2">Soreness after last session</h3>
                <div className="grid grid-cols-4 gap-4">
                  <RadioBtn
                    id="soreness1"
                    name="soreness"
                    text="No Soreness"
                    onChange={() => setSoreness(0)}
                    checked={soreness === 0}
                    size={radioSize}
                  />
                  <RadioBtn
                    id="soreness2"
                    name="soreness"
                    text="Mild Soreness"
                    onChange={() => setSoreness(1)}
                    checked={soreness === 1}
                    size={radioSize}
                  />
                  <RadioBtn
                    id="soreness3"
                    name="soreness"
                    text="Moderate Soreness"
                    onChange={() => setSoreness(2)}
                    checked={soreness === 2}
                    size={radioSize}
                  />
                  <RadioBtn
                    id="soreness4"
                    name="soreness"
                    text="Severe Soreness"
                    onChange={() => setSoreness(3)}
                    checked={soreness === 3}
                    size={radioSize}
                  />
                </div>
              </div>
            )}
            <div>
              <h3 className="text-xl font-semibold text-primary-text mb-2">Joint pain today</h3>
              <div className="grid grid-cols-4 gap-4">
                <RadioBtn
                  id="jointpain1"
                  name="jointpain"
                  text="No Pain"
                  onChange={() => setJointPain(0)}
                  checked={jointpain === 0}
                  size={radioSize}
                />
                <RadioBtn
                  id="jointpain2"
                  name="jointpain"
                  text="Mild Pain"
                  onChange={() => setJointPain(1)}
                  checked={jointpain === 1}
                  size={radioSize}
                />
                <RadioBtn
                  id="jointpain3"
                  name="jointpain"
                  text="Moderate Pain"
                  onChange={() => setJointPain(2)}
                  checked={jointpain === 2}
                  size={radioSize}
                />
                <RadioBtn
                  id="jointpain4"
                  name="jointpain"
                  text="Severe Pain"
                  onChange={() => setJointPain(3)}
                  checked={jointpain === 3}
                  size={radioSize}
                />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-primary-text mb-2">Workload today</h3>
              <div className="grid grid-cols-4 gap-4">
                <RadioBtn
                  id="workload1"
                  name="workload"
                  text="Easy"
                  onChange={() => setWorkload(0)}
                  checked={workload === 0}
                  size={radioSize}
                />
                <RadioBtn
                  id="workload2"
                  name="workload"
                  text="Pretty Good"
                  onChange={() => setWorkload(1)}
                  checked={workload === 1}
                  size={radioSize}
                />
                <RadioBtn
                  id="workload3"
                  name="workload"
                  text="Challenging"
                  onChange={() => setWorkload(2)}
                  checked={workload === 2}
                  size={radioSize}
                />
                <RadioBtn
                  id="workload4"
                  name="workload"
                  text="Too Much"
                  onChange={() => setWorkload(3)}
                  checked={workload === 3}
                  size={radioSize}
                />
              </div>
            </div>

            <button
              type="submit"
              className={`flex justify-center items-center p-4 rounded-lg text-background font-semibold text-lg ${
                isFormValid ? 'bg-black hover:bg-gray-800 text-background' : 'bg-gray-400 cursor-not-allowed'
              }`}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader size={6} color="background" />
                  <span className="ml-2 text-background">Submitting...</span>
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
