export function Button({ onClick, children }) {
  return (
    <button
      type="button"
      className="bg-emerald-600 p-1 px-3 m-1 mx-3 rounded-md"
      onClick={onClick}>
        {children}
    </button>
  );
}
