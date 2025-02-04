import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { setPagination } from '../../../features/RolePaginationSlice';

interface Props {
    totalPages?: number;
    setDataNull:()=>void;
}

function CustomPagination({ totalPages,setDataNull }: Props) {

    const PaginationReducer = useSelector((state: RootState) => state.RolePaginationSlice);

    const dispatch = useDispatch()


    function handlePageClick(page: number) {
        const updatedPagination = {
            ...PaginationReducer.pagination,
            page: page + 1
        }
        dispatch(setPagination(updatedPagination))
        setDataNull()
    }

    const onChangeLimit = (limit: number) => {
        const updatedPagination = {
            ...PaginationReducer.pagination,
            limit: limit,
            page: 1
        }
        dispatch(setPagination(updatedPagination))
        setDataNull()
    }

    return (
        <div className='my-5'>
            <div className='flex justify-between items-center gap-3'>
                <div className="appearance-none bg-white border border-gray-100 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:border-blue-500 flex flex-row justify-between">
                    <label className='block text-sm font-medium text-gray-700'>Limit : &nbsp;</label>
                    <select
                        className='bg-transparent border border-gray-300 rounded-md w-14 pl-1'
                        onChange={(e) => onChangeLimit(parseInt(e.target.value))}
                        value={PaginationReducer.pagination.limit}
                    >
                        <option value={10}>10</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>

                <ReactPaginate
                    breakLabel={<span className='mr-4 flex items-center justify-center'>...</span>}
                    nextLabel={<div className='p-2 flex items-center justify-center bg-slate-200 rounded-md'>
                        <IoIosArrowForward />        </div>}
                    onPageChange={(e) => handlePageClick(e.selected)}
                    pageRangeDisplayed={5}
                    pageCount={totalPages ? totalPages : 0}
                    previousLabel={<div className='w-8 h-8 flex items-center justify-center bg-slate-200 rounded-md mr-2'>
                        <IoIosArrowBack />        </div>}
                    renderOnZeroPageCount={null}
                    containerClassName="pagination flex space-x-2"
                    pageLinkClassName="page-num"
                    previousLinkClassName="page-num"
                    nextLinkClassName="page-num"
                    activeLinkClassName="active"
                    pageClassName='block mr-2 rounded-md  tex-black px-3 text-xs flex items-center justify-center hover:bg-slate-300'
                    activeClassName={`bg-primary text-white hover:bg-themeblue hover:text-white`}
                />
            </div>
        </div>
    );
}

export default CustomPagination;