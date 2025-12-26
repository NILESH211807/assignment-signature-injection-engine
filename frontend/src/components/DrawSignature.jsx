import { useCallback, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import SignatureCanvas from 'react-signature-canvas';
import { usePdf } from '../hooks/usePdf';
import { v4 as uuidv4 } from 'uuid';
import { LuUpload } from "react-icons/lu";

const DrawSignature = ({ handleUpdateFields }) => {

    const sigCanvas = useRef(null);
    const { setIsOpenSignModel } = usePdf();
    const [isDrawSign, setIsDrawSign] = useState(true);
    const [isDragOver, setIsDragOver] = useState(false);
    const [signedImageBase64, setSignedImageBase64] = useState(null);
    const [imgDimensions, setImgDimensions] = useState({
        imgWidth: 0,
        imgHeight: 0,
    })

    const clear = () => sigCanvas.current.clear();

    const clearAll = () => {
        setSignedImageBase64(null);
        setIsDrawSign(true);
        setIsOpenSignModel(false);
    }

    const saveCanvasSignature = () => {
        let image = null;

        if (sigCanvas?.current?.isEmpty() && isDrawSign) {
            toast.error('Please draw signature');
            return;
        }

        if (!isDrawSign && !signedImageBase64) {
            toast.error('Please upload signature');
            return;
        }

        if (!isDrawSign && signedImageBase64) {
            image = signedImageBase64;
        }

        if (isDrawSign && !sigCanvas?.current?.isEmpty()) {
            image = sigCanvas.current.toDataURL();
        }

        if (!image) {
            toast.error('Please draw signature or upload signature');
            return;
        }

        const data = {
            id: uuidv4(),
            type: "signature",
            x: Math.random() * 200 + 50,
            y: Math.random() * 200 + 50,
            w: imgDimensions.imgWidth || 150,
            h: imgDimensions.imgHeight || 70,
            imageBase64: image,
        }

        handleUpdateFields(data);
        clearAll();
    }

    const handleFileChanges = (file) => {
        try {

            const imageTyes = ['image/png', 'image/jpeg', 'image/jpg'];

            if (file && !imageTyes.includes(file.type)) {
                throw new Error("Only Image files are allowed");
            } else if (file && file.size > 1024 * 1024 * 5) {
                throw new Error("File size should be less than 5MB");
            }

            const img = new Image();
            const objectUrl = URL.createObjectURL(file);
            img.src = objectUrl;

            img.onload = () => {
                const width = img.naturalWidth;
                const height = img.naturalHeight;

                if (width > 300) {
                    const ratio = width / 300;
                    setImgDimensions({
                        imgWidth: 300,
                        imgHeight: height / ratio,
                    });
                }

                URL.revokeObjectURL(objectUrl);
            }

            // base 64 image 
            const reader = new FileReader();
            reader.onload = () => {
                setSignedImageBase64(reader.result);

            };
            reader.readAsDataURL(file);

        } catch (error) {
            toast.error(error.message);
        }
    }

    const handleFileChange = (event) => handleFileChanges(event.target.files[0]);

    // handleOnDrag
    const handleOnDrop = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        handleFileChanges(event.dataTransfer.files[0]);
        setIsDragOver(false);
    }, []);


    const handleOnDragOver = useCallback((event) => {
        event.preventDefault();
        setIsDragOver(true);
    }, [setIsDragOver])

    const handleOnDragLeave = useCallback((event) => {
        event.preventDefault();
        setIsDragOver(false);
    }, [setIsDragOver])

    return (
        <>
            <div className='w-full h-full fixed top-0 left-0 bg-gray-950/50 z-1000'>
            </div>
            <div className='w-xl max-w-[95%] rounded-md bg-white fixed z-1001 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-5 max-sm:p-3'>
                <h1 className='text-left text-sm font-semibold w-full'>Draw Or Upload Your Signature</h1>
                <div className='w-full flex items-center justify-start gap-5 my-3'>
                    <button onClick={() => setIsDrawSign(true)} className={`${isDrawSign ? 'bg-(--accent) text-white' : 'bg-gray-200 hover:bg-gray-300'} transition-all duration-300 ease-in text-sm font-semibold rounded-md px-4 py-1.25 cursor-pointer`}>Draw Sign</button>
                    <button onClick={() => setIsDrawSign(false)} className={`${!isDrawSign ? 'bg-(--accent) text-white' : 'bg-gray-200 hover:bg-gray-300'} transition-all duration-300 ease-in text-sm font-semibold rounded-md px-4 py-1.25 cursor-pointer`}>Upload Sign</button>
                </div>
                <div className='w-full flex items-center justify-center mt-5'>
                    {
                        isDrawSign ? (
                            <SignatureCanvas penColor='black'
                                canvasProps={{ width: 500, height: 200, className: 'sigCanvas border border-gray-300 rounded-md w-full' }}
                                ref={sigCanvas} />
                        ) : (
                            <>

                                <label htmlFor="dropzone-file" className={`flex flex-col items-center justify-center w-full h-50 mb-5 border ${isDragOver ? "border-(--accent)" : "border-gray-400"} border-dashed rounded-xl cursor-pointer bg-gray-300/10 hover:bg-gray-300/20 hover:border-(--accent) transition-all duration-300 ease-in-out`}
                                    onDrop={handleOnDrop}
                                    onDragLeave={handleOnDragLeave}
                                    onDragOver={handleOnDragOver}>
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        {signedImageBase64 ? (
                                            <img src={signedImageBase64} alt="signed image" className="w-full h-40 object-contain" />
                                        ) : (

                                            <>
                                                <div className="bg-gray-200 p-5 border-2 border-gray-300 rounded-full mb-4">
                                                    <LuUpload size={30} />
                                                </div>
                                                <p className="text-[14px] text-gray-800 font-medium">Browse or drag a Image</p>
                                                <p className="text-sm font-medium text-gray-800">Supported Files : Png, Jpg, Jpeg</p>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        id="dropzone-file"
                                        onChange={handleFileChange}
                                        type="file" className="hidden"
                                        accept="image/*" />
                                </label>

                            </>
                        )
                    }
                </div>

                <div className='w-full flex items-center'>
                    {
                        isDrawSign && (
                            <button onClick={clear} className='bg-gray-200 hover:bg-gray-300 transition-all duration-300 ease-in text-sm font-semibold rounded-md px-4 py-1.25 cursor-pointer  max-sm:text-[12px]'>Clear</button>
                        )
                    }

                    {
                        signedImageBase64 && (
                            <button onClick={() => setSignedImageBase64(null)} className='bg-gray-200 hover:bg-gray-300 transition-all duration-300 ease-in text-sm font-semibold rounded-md px-4 py-1.25 cursor-pointer  max-sm:text-[12px]'>Remove</button>
                        )
                    }
                    <div className='w-full flex justify-end gap-5 mt-5'>
                        <button onClick={clearAll} className='bg-red-600 hover:bg-red-700 transition-all duration-300 ease-in text-white text-sm font-semibold rounded-md px-4 py-2 cursor-pointer  max-sm:text-[12px]'>Close</button>
                        <button onClick={saveCanvasSignature} className='bg-(--accent) text-white text-sm font-semibold rounded-md px-4 py-2 cursor-pointer max-sm:text-[12px]'>Save Signature</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DrawSignature
