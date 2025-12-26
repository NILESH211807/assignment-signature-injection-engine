import { Activity, useEffect, useRef, useState } from 'react'
import ToolBar from '../components/ToolBar';
import { Document, Page } from 'react-pdf';
import { usePdf } from '../hooks/usePdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import DragAndResize from '../components/DragAndResize';
import DrawSignature from '../components/DrawSignature';
import { useNavigate } from 'react-router-dom';
import { getRelPosition, getRelSize } from '../utils/coordinate';
import debounce from '../utils/dbounce';
import DraggableTextBox from '../components/DraggableTextBox';

const PdfViewer = () => {

    const { pdfFile, isOpenSignModel, fields, setFields } = usePdf();
    const [pageNumber, setPageNumber] = useState(1);
    const [pages, setPages] = useState([]);
    const navigate = useNavigate();
    const pageRef = useRef();
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    const handleResize = debounce(() => {
        setScreenWidth(window.innerWidth);
    }, 500);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () =>
            window.removeEventListener('resize', handleResize);
    }, [handleResize]);


    useEffect(() => {
        if (!pdfFile) navigate('/');
    }, [pdfFile, navigate]);


    const onDocumentLoadSuccess = ({ numPages }) => {
        setPages(Array.from(new Array(numPages), (el, index) => index + 1))
    }

    const handleUpdateFields = (field) => {
        if (!field) return;

        const rect = pageRef.current.getBoundingClientRect();

        const pos = getRelPosition(field.x, field.y, rect.width, rect.height);
        const size = getRelSize(field.w, field.h, rect.width, rect.height);

        setFields(prev =>
            prev.some(f => f.id === field.id)
                ? prev.map(f =>
                    f.id === field.id
                        ? {
                            ...f,
                            pageNumber,
                            xPercent: pos.xPercent,
                            yPercent: pos.yPercent,
                            widthPercent: size.widthPercent,
                            heightPercent: size.heightPercent,
                        }
                        : f
                )
                : [
                    ...prev,
                    {
                        ...field,
                        pageNumber,
                        xPercent: pos.xPercent,
                        yPercent: pos.yPercent,
                        widthPercent: size.widthPercent,
                        heightPercent: size.heightPercent,
                    },
                ]
        );


    }

    return (
        <div className='w-full min-h-screen p-10 max-sm:px-4'>
            <ToolBar handleUpdateFields={handleUpdateFields} />
            <div className='min-h-screen relative mx-auto w-full mt-6 min-[1100px]:pl-40'
                style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
                <div className='w-full flex items-center justify-center gap-5 max-sm:flex-wrap max-sm:gap-2'>
                    {
                        pages.map((el, index) => (
                            <button key={index}
                                onClick={() => setPageNumber(index + 1)}
                                className={`text-sm font-semibold max-sm:px-5 max-sm:mb-10 rounded-md mb-5 cursor-pointer border border-(--border) px-8 py-2 ${pageNumber === index + 1 ? 'bg-gray-600 text-gray-200 ' : 'bg-gray-100 text-gray-800 '}`}>
                                Page {index + 1}
                            </button>
                        ))
                    }
                </div>
                <Document
                    file={pdfFile}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="flex flex-col items-center gap-4 min-h-screen">
                    <div>
                        <div ref={pageRef} className='border border-(--border) relative'>
                            {
                                fields?.map((field, index) => {
                                    if (field.pageNumber === pageNumber && field.type === 'signature') {
                                        return <DragAndResize
                                            key={index} field={field}
                                            handleUpdateFields={handleUpdateFields} />
                                    } else if (field.pageNumber === pageNumber && field.type === 'textbox') {
                                        return <DraggableTextBox
                                            key={index} field={field}
                                            handleUpdateFields={handleUpdateFields}
                                            pageRef={pageRef} />
                                    }
                                })
                            }
                            <Page
                                pageNumber={pageNumber}
                                width={screenWidth > 768 ? 650 : screenWidth - 50}
                                renderTextLayer={false}
                                renderAnnotationLayer={true}
                            />
                        </div>
                    </div>
                </Document>
                <Activity mode={`${isOpenSignModel ? 'visible' : 'hidden'}`}>
                    <DrawSignature handleUpdateFields={handleUpdateFields} />
                </Activity>
            </div>
        </div>
    )
}

export default PdfViewer;
