// ShadCn
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";

const useToasts = () => {
    type SendMailErrorType = {
        email: string;
        sendPdfToMail: (email: string) => void;
    };

    type SendWhatsAppErrorType = {
        phoneNumber: string;
        sendInvoiceToWhatsApp: (phoneNumber: string) => void;
    };

    const newInvoiceSuccess = () => {
        toast({
            variant: "default",
            title: "Generated new invoice",
            description: "Successfully created a new invoice",
        });
    };

    const pdfGenerationSuccess = () => {
        toast({
            variant: "default",
            title: "Your invoice has been generated!",
            description:
                "You can preview, download, or save it from the actions tab",
        });
    };

    const saveInvoiceSuccess = () => {
        toast({
            variant: "default",
            title: "Saved Invoice",
            description: "Your invoice details are saved now",
        });
    };

    const modifiedInvoiceSuccess = () => {
        toast({
            variant: "default",
            title: "Modified Invoice",
            description: "Successfully modified your invoice",
        });
    };

    const sendPdfSuccess = () => {
        toast({
            variant: "default",
            title: "Email sent",
            description: "Your invoice has been sent to the specified email",
        });
    };

    const sendPdfError = ({ email, sendPdfToMail }: SendMailErrorType) => {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Something went wrong. Try again in a moment",
            action: (
                <ToastAction
                    onClick={() => sendPdfToMail(email)}
                    altText="Try again"
                >
                    Try again
                </ToastAction>
            ),
        });
    };

    const importInvoiceError = () => {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Something went importing the invoice. Make sure the file is a valid fatoora JSON export",
        });
    };

    const sendWhatsAppSuccess = () => {
        toast({
            variant: "default",
            title: "WhatsApp message sent",
            description: "Your invoice has been sent via WhatsApp",
        });
    };

    const sendWhatsAppError = ({ phoneNumber, sendInvoiceToWhatsApp }: SendWhatsAppErrorType) => {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Something went wrong. Try again in a moment",
            action: (
                <ToastAction
                    onClick={() => sendInvoiceToWhatsApp(phoneNumber)}
                    altText="Try again"
                >
                    Try again
                </ToastAction>
            ),
        });
    };

    return {
        newInvoiceSuccess,
        pdfGenerationSuccess,
        saveInvoiceSuccess,
        modifiedInvoiceSuccess,
        sendPdfSuccess,
        sendPdfError,
        importInvoiceError,
        sendWhatsAppSuccess,
        sendWhatsAppError,
    };
};

export default useToasts;
