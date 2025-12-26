import { FaRegImage, FaSignature } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { BsInputCursor } from "react-icons/bs";
import { usePdf } from '../hooks/usePdf';

const ToolBar = () => {

    const { setIsOpenSignModel, isMenuOpen, setIsMenuOpen } = usePdf();

    return (
        <>
            <div onClick={() => setIsMenuOpen(false)} className={`w-full h-full fixed top-0 left-0 bg-gray-950/50 z-52 min-[1100px]:hidden ${isMenuOpen ? 'block' : 'hidden'}`}></div>
            <aside id="sidebar" className={`bg-white border-r h-screen fixed top-0 min-[1100px]:top-16 left-0 border-gray-200 w-64 z-30 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} min-[1100px]:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col justify-between shadow-lg min-[1100px]:shadow-none max-[1100px]:z-53`}>
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-hide">
                    <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu</p>

                    <Link onClick={() => {
                        setIsOpenSignModel(true);
                        setIsMenuOpen(false);
                    }} to="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-indigo-600 rounded-xl transition-colors text-sm group font-semibold">
                        <FaSignature size={20} />
                        <span>Signature</span>
                    </Link>

                    <Link to="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-indigo-600 rounded-xl transition-colors text-sm group font-semibold">
                        <BsInputCursor size={20} />
                        <span>Text Box</span>
                    </Link>

                    {/* <Link href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-indigo-600 text-sm rounded-xl transition-colors group font-semibold">
                        <FaRegImage size={15} />
                        <span>Image</span>
                    </Link> */}
                </nav>
            </aside>
        </>
    )
}

export default ToolBar;
