import { useState, createContext } from "react";

// create context
const PDFFileContext = createContext();

// create provider
export const PDFFileProvider = ({ children }) => {
    const [pdfFile, setPDFFile] = useState(null);
    const [isOpenSignModel, setIsOpenSignModel] = useState(false);
    const [signFields, setSignFields] = useState([]);
    const [fields, setFields] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const values = {
        pdfFile,
        setPDFFile,
        isOpenSignModel,
        setIsOpenSignModel,
        signFields,
        setSignFields,
        fields,
        setFields,
        isMenuOpen,
        setIsMenuOpen,
    }

    return (
        <PDFFileContext.Provider value={values}>
            {children}
        </PDFFileContext.Provider>
    );
};

export default PDFFileContext;

