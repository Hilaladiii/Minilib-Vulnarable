export default function RowSkeleton({ index }: { index: number }) {
  return (
    <tr
      key={index}
      className={`${
        index % 2 === 0 ? "bg-gray-50" : "bg-white"
      } border-b transition-colors`}
    >
      <td className="p-4">
        <div className="h-14 w-14 bg-gray-300 rounded-md animate-pulse mx-auto"></div>
      </td>
      <td className="p-4">
        <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
      </td>
      <td className="p-4">
        <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
      </td>
      <td className="p-4">
        <div className="h-4 bg-gray-300 rounded w-2/3 animate-pulse"></div>
      </td>
      <td className="p-4">
        <div className="h-4 bg-gray-300 rounded w-1/4 animate-pulse"></div>
      </td>
      <td className="p-4 text-center">
        <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse mx-auto"></div>
      </td>
    </tr>
  );
}
