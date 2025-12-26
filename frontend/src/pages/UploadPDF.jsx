
import React, { useCallback, useState } from 'react'
import { ArrowUpFromLine, Trash2, Upload } from 'lucide-react';
import { usePdf } from '../hooks/usePdf';
import toast from 'react-hot-toast';
import { FaFilePdf } from "react-icons/fa6";
import { GrFormNext } from "react-icons/gr";
import { RiDeleteBinFill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';


function formatFileSize(size) {
    if (size === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

const UploadPDF = () => {

    const { pdfFile, setPDFFile, setSignFields } = usePdf();
    const [isDragOver, setIsDragOver] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        try {
            const file = event.target.files[0];
            if (file && file.type !== "application/pdf") {
                throw new Error("Only PDF files are allowed");
            } else if (file && file.size > 1024 * 1024 * 5) {
                throw new Error("File size should be less than 5MB");
            }
            setPDFFile(file);
            navigate("/sign-pdf");
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    // handleRemoveFile
    const handleRemoveFile = useCallback(() => {
        setPDFFile(null);
        setSignFields([]);
    }, [setPDFFile, setSignFields]);

    // handleOnDrag
    const handleOnDrop = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        const file = event.dataTransfer.files[0];
        if (file && file.type !== "application/pdf") {
            throw new Error("Only PDF files are allowed");
        } else if (file && file.size > 1024 * 1024 * 5) {
            throw new Error("File size should be less than 5MB");
        }
        setPDFFile(file);
        setIsDragOver(false);
    }, [setPDFFile]);

    // handleOnDragLeave
    const handleOnDragLeave = useCallback((event) => {
        event.preventDefault();
        setIsDragOver(false);
    }, [setIsDragOver])

    const handleOnDragOver = useCallback((event) => {
        event.preventDefault();
        setIsDragOver(true);
    }, [setIsDragOver])

    return (
        <div className='w-full min-h-screen flex mt-16 justify-center'>
            <div className="w-full max-w-3xl px-3">
                <label htmlFor="dropzone-file" className={`flex flex-col items-center justify-center w-full h-80 border ${isDragOver ? "border-(--accent)" : "border-gray-400"} border-dashed rounded-xl cursor-pointer bg-gray-300/10 hover:bg-gray-300/20 hover:border-(--accent) transition-all duration-300 ease-in-out`}
                    onDrop={handleOnDrop}
                    onDragLeave={handleOnDragLeave}
                    onDragOver={handleOnDragOver}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">

                        {
                            pdfFile ? (
                                <div className='flex flex-col items-center justify-center gap-3'>
                                    <FaFilePdf className='text-gray-500' size={50} />
                                    <p className='text-gray-800 text-sm'>{pdfFile.name}</p>
                                    <p className='text-gray-800 text-xs font-medium bg-gray-200 px-3 py-1.25 rounded-md'>Size: {formatFileSize(pdfFile.size)}</p>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-gray-200 p-5 border-2 border-gray-300 rounded-full mb-4">
                                        <Upload size={30} />
                                    </div>
                                    <p className="text-[16px] text-gray-800 font-medium">Browse or drag a file here</p>
                                    <p className="text-sm font-medium text-gray-800">Supported Files : PDF Only</p>
                                </>
                            )
                        }
                    </div>
                    <input
                        id="dropzone-file"
                        onChange={handleFileChange}
                        type="file" className="hidden"
                        accept=".pdf,.doc,.docx" />
                </label>

                {
                    pdfFile && (
                        <div className={`flex justify-between my-5`}>
                            <button onClick={handleRemoveFile} disabled={!pdfFile} className="mt-4 text-sm cursor-pointer font-semibold bg-red-600 text-white px-5 py-2 rounded-full hover:bg-red-700 transition-all duration-300 ease-in-out flex items-center gap-2 disabled:bg-red-500">
                                Remove
                                <RiDeleteBinFill size={18} />
                            </button>
                            <button
                                onClick={() => navigate("/sign-pdf")}
                                disabled={!pdfFile} className="mt-4 text-sm cursor-pointer font-semibold bg-(--accent) text-white px-5 py-2 rounded-full hover:bg-(--accent-hover) transition-all duration-300 ease-in-out flex items-center">
                                Next
                                <GrFormNext size={18} />
                            </button>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default UploadPDF;
