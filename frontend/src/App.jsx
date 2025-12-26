import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import MainLayout from './layout/MainLayout'
import { Toaster } from 'react-hot-toast';
import Loading from './components/Loading';
// const UploadPDF = React.lazy(() => import('./pages/UploadPDF'));
// const PdfViewer = React.lazy(() => import('./pages/PdfViewer'));
import UploadPDF from './pages/UploadPDF';
import PdfViewer from './pages/PdfViewer'

const App = () => {
    return (
        <>

            <Routes>
                <Route path='/' element={
                    // <Suspense fallback={<Loading />}>
                    <MainLayout>
                        <UploadPDF />
                    </MainLayout>
                    // </Suspense>
                } />
                <Route path='/sign-pdf' element={
                    // <Suspense fallback={<Loading />}>
                    <MainLayout>
                        <PdfViewer />
                    </MainLayout>
                    // </Suspense>
                } />
            </Routes>
            <Toaster />
        </>
    )
}

export default App
