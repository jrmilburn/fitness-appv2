import DashboardProgram from "./components/Dashboard/Program";
import DashboardWorkout from "./components/Dashboard/CurrentWorkout";
import DashboardUser from "./components/Dashboard/User";

export default async function Home() {
  return (
    <div className="grid grid-cols-2 grid-rows-2 min-h-screen gap-4 p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="w-full h-full">
        <DashboardWorkout />
      </div>
      <div className="w-full h-full">
        <DashboardProgram />
      </div>
      <div className="col-span-2 w-full h-full">
        <DashboardUser />
      </div>
    </div>
  );
}