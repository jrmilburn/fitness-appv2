import Search from "@/app/components/Nutrition/Search/Search";

export default function NewFood({ visible, addFood, onClose }) {


  return (
    <>
      {visible && (
        <div className="fixed inset-0 bg-black bg-opacity-50">
          <div className="bg-background max-w-[400px] max-h-[60%] h-[60%] overflow-y-auto absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] rounded-lg">
            <button className="absolute top-0 right-0" onClick={onClose}>
              X
            </button>
              <Search
                addFood={ (selectedFood) => {
                  addFood(selectedFood)
                }
                }
              />
          </div>
        </div>
      )}
    </>
  );
}