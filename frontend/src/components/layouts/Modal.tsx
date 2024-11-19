export default function Modal({
  children,
  isOpen,
  onClose,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-40 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="w-full mt-10 max-w-md flex transform flex-col items-center justify-center rounded-2xl bg-white p-8 transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
