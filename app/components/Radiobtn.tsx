export default function RadioBtn({ id, name, text, onChange, checked }) {
  return (
      <div className="flex space-x-6">
          <div className="relative">
              {/* Hidden Radio Input */}
              <input
                  type="radio"
                  id={id}
                  name={name}
                  value={text}
                  className="hidden peer"
                  checked={checked}
                  onChange={onChange}
              />
              
              {/* Label Styled as Button */}
              <label
                  htmlFor={id}
                  className="peer-checked:bg-black peer-checked:text-white w-16 h-10 border-2 border-gray-300 flex items-center justify-center text-center text-gray-700 rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-100 peer-hover:shadow-md"
              >
                  {text}
              </label>
          </div>
      </div>
  );
}