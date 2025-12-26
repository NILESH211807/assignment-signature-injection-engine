import React, { Activity, useState } from 'react'
import { usePdf } from '../hooks/usePdf';
import useFetch from '../hooks/useFetch';
import toast from 'react-hot-toast';
import SignedUrl from './SignedUrl';
import { IoMenu } from 'react-icons/io5';

const Header = () => {

    const { fields, pdfFile, setIsMenuOpen } = usePdf();
    const { postFetch } = useFetch();
    const [isLoading, setIsLoading] = useState(false);
    const [signedUrl, setSignedUrl] = useState('');
    const [isSignedUrl, setIsSignedUrl] = useState(false);


    const handleSave = async () => {
        setIsLoading(true);
        try {

            const formData = new FormData();
            formData.append('fields', JSON.stringify(fields));
            formData.append('pdfFile', pdfFile);

            const res = await postFetch('/api/sign-pdf', formData, {
                'Content-Type': 'multipart/form-data',
            });
            if (res?.message === "Signed successfully") {
                toast.success(res.message);
                setSignedUrl(res.url);
                setIsSignedUrl(true);
            } else {
                toast.error(res.message);
            }

        } catch (error) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className="w-full h-16 bg-white border-b border-(--border) sticky top-0 z-50">
                <div className='w-full h-full max-w-360 mx-auto flex items-center justify-between px-5'>
                    <h1 className="text-[16px] font-semibold">Signature Injection Engine</h1>
                    {
                        fields.length > 0 && (
                            <button disabled={isLoading} onClick={handleSave} type='button' className='ml-auto bg-(--accent) cursor-pointer text-sm font-semibold rounded-full disabled:opacity-60 text-white px-5 py-2'>
                                {isLoading ? "Loading..." : "Save"}
                            </button>
                        )
                    }
                    <IoMenu onClick={() => setIsMenuOpen(true)} className='mx-5 text-2xl cursor-pointer hidden max-[1100px]:block' />
                </div>
            </div>

            <Activity mode={isSignedUrl ? 'visible' : 'hidden'}>
                <SignedUrl signedUrl={signedUrl} setIsSignedUrl={setIsSignedUrl} />
            </Activity>
        </>

    )
}

export default Header;
