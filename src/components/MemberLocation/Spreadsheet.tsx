import Cell from "./Cell";
import { cellData } from "./utils/cellData";
import { type Member } from "./utils/types";

const Spreadsheet = ({
  self,
  others,
  setLocation,
}: {
  self: Member | null;
  others: Member[];
  setLocation: (location: Member["location"]) => void;
}) => {
  const handleClick = (row: number, col: number) => {
    setLocation({ row, col });
  };

  return (
    <table className="max-w-[360px] min-w-[290px] w-1/2 border-gray-350 border-[0.25px] border-separate border-spacing-0 bg-slate-150 text-xs text-left">
      <tbody>
        {cellData.map((row, rowIndex) => (
          <tr key={rowIndex}>
            <td
              key={rowIndex}
              className="w-[10%] px-2 py-2 h-10 bg-slate-250 border-gray-350 border-[0.25px] text-center"
            >
              {rowIndex + 1}
            </td>

            {row.map((col, colIndex) => {
              const cellMembers = others.filter((user) => {
                return (
                  user.location?.row === rowIndex &&
                  user.location?.col === colIndex
                );
              });

              return (
                <Cell
                  key={colIndex}
                  value={col}
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  cellMembers={cellMembers}
                  self={self}
                  handleClick={handleClick}
                />
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Spreadsheet;
