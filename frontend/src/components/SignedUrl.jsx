import { Link } from 'react-router-dom'

const SignedUrl = ({ setIsSignedUrl, signedUrl }) => {
    return (
        <>
            <div className='w-full h-full fixed top-0 left-0 bg-gray-950/50 z-1000'>
            </div>
            <div className='w-120 max-w-[90%] rounded-md bg-white fixed z-1001 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-5'>
                <h1 className='text-center text-sm font-semibold text-green-700 mt-5'>Signed PDF Generated Successfully</h1>
                <div className='flex flex-col gap-5 mt-5'>
                    <input readOnly value={signedUrl}
                        type="text" name="" id=""
                        className="border border-gray-300 rounded-md py-2 px-4 text-sm font-semibold outline-none" />
                    <div className='flex gap-3 justify-end pb-3'>
                        <button onClick={() => setIsSignedUrl(false)} className='bg-red-600 cursor-pointer text-white rounded-md px-4 py-2 text-sm font-semibold'>Close</button>
                        <Link to={signedUrl} target={'_blank'} className='bg-green-600 cursor-pointer text-white rounded-md px-4 py-2 text-sm font-semibold'>Open</Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SignedUrl;
