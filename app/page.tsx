import DashboardProgram from "./components/Dashboard/Program";
import DashboardWorkout from "./components/Dashboard/CurrentWorkout";
import DashboardUser from "./components/Dashboard/User";

export default async function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-4">
        <div className="w-full h-full">
          <DashboardProgram />
        </div>
        <div className="w-full h-full">
          <DashboardWorkout />
        </div>
        <div className="w-full h-full">
          <DashboardUser />
        </div>
      </div>
    </div>
  );
}