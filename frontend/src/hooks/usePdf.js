import { useContext } from "react";
import PDFFileContext from "../provider/pdfFileProvider";


export const usePdf = () => {
    return useContext(PDFFileContext);
}