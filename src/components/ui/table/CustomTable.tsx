import React from "react";
import CustomPagination from "./CustomPagination";

interface Props {
    th?: string[];
    td?: React.ReactNode[]; // Allow JSX elements (like <tr> elements)
    totalPages?: number,
    setDataNull:()=>void;
}

const CustomTable: React.FC<Props> = ({ th, td, totalPages,setDataNull }) => {
    return (
        <div>
            <table className="w-full">
                <thead className="text-sm text-black">
                    <tr className="rounded-lg bg-lightGray text-left">
                        {th?.map((ele, i) => (
                            <th key={i} className={`${i === 0 ? 'rounded-l-lg' : i + 1 === th.length ? 'rounded-r-lg' : ''} p-2`}>{ele}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="rounded-lg bg-white">
                    {td?.length ? td.map((row, i) => <React.Fragment key={i}>
                        {React.cloneElement(row as React.ReactElement, {
                            className: "border-b border-lightgray",
                        })}
                    </React.Fragment>) : (
                        <tr>
                            <td colSpan={th?.length || 1} className="text-center p-5">
                                No Data Found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="mt-10">
                <CustomPagination setDataNull={setDataNull} totalPages={totalPages} />
            </div>
        </div>
    );
};

export default CustomTable;
