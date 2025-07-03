export function Button({ children, ...props }) {
  return (
    <button {...props} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
      {children}
    </button>
  );
}

export default Button;
