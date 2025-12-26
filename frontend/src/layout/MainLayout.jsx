import React from 'react'
import Header from '../components/Header'
import { PDFFileProvider } from '../provider/pdfFileProvider';

const MainLayout = ({ children }) => {
    return (
        <div className="w-full min-h-screen">
            <PDFFileProvider>
                <Header />
                {children}
            </PDFFileProvider>
        </div>
    )
}

export default MainLayout
