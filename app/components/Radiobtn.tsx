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
                  className="peer-checked:bg-primary-text peer-checked:text-background w-16 h-10 border-2 border-border flex items-center justify-center text-center text-primary-text rounded-lg cursor-pointer transition-all duration-300 hover:bg-primary-text hover:text-background peer-hover:shadow-md"
              >
                  {text}
              </label>
          </div>
      </div>
  );
}