"use client";

// ShadCn
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

// Components
import {
    PdfViewer,
    BaseButton,
    NewInvoiceAlert,
    InvoiceLoaderModal,
    InvoiceExportModal,
} from "@/app/components";
import {Img} from "@react-email/components";

// Contexts
import {useInvoiceContext} from "@/contexts/InvoiceContext";
import {useTranslationContext} from "@/contexts/TranslationContext";
import {useFormContext, useWatch} from "react-hook-form";

// Icons
import {FileInput, FolderUp, Import, Plus, RotateCcw} from "lucide-react";
import WhatsAppMock from "@/app/components/invoice/WhatsAppMock";
import WhatsAppIcon from "@/public/assets/img/whatsapp.svg";

const InvoiceActions = () => {
    const {invoicePdfLoading, newInvoice} = useInvoiceContext();
    const {control} = useFormContext();

    const {_t} = useTranslationContext();
    const formValues = useWatch({control});
    const exportType = useWatch({
        name: "exportType",
        control,
    });

    const renderPreview = () => {
        switch (exportType) {
            case "csv":
                return (
                    <div className="p-4 text-center">CSV DataGrid Preview</div>
                );
            case "json":
                return (
                    <pre className="w-full h-full p-4 overflow-auto text-sm bg-gray-100 rounded-md dark:bg-gray-800">
            <code>{JSON.stringify(formValues, null, 2)}</code>
          </pre>
                );
            case "whatsapp":
                return (<WhatsAppMock/>);
            case "pdf":
            default:
                return <PdfViewer/>;
        }
    };

    return (
        <div className={`xl:w-[45%]`}>
            <Card className="h-auto sticky top-0 px-2">
                <CardHeader>
                    <CardTitle>{_t("actions.title")}</CardTitle>
                    <CardDescription>{_t("actions.description")}</CardDescription>
                </CardHeader>

                <div className="flex flex-col flex-wrap items-center gap-2">
                    <div className="flex flex-wrap justify-center gap-3">
                        {/* Load modal button */}
                        <InvoiceLoaderModal>
                            <BaseButton
                                variant="outline"
                                tooltipLabel="Open load invoice menu"
                                disabled={invoicePdfLoading}
                            >
                                <FolderUp/>
                                {_t("actions.loadInvoice")}
                            </BaseButton>
                        </InvoiceLoaderModal>

                        {/* Export modal button */}
                        <InvoiceExportModal>
                            <BaseButton
                                variant="outline"
                                tooltipLabel="Open export invoice menu"
                                disabled={invoicePdfLoading}
                            >
                                <Import/>
                                {_t("actions.exportInvoice")}
                            </BaseButton>
                        </InvoiceExportModal>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3">
                        {/* New invoice button */}
                        <NewInvoiceAlert>
                            <BaseButton
                                variant="outline"
                                tooltipLabel="Get a new invoice form"
                                disabled={invoicePdfLoading}
                            >
                                <Plus/>
                                {_t("actions.newInvoice")}
                            </BaseButton>
                        </NewInvoiceAlert>

                        {/* Reset form button */}
                        <NewInvoiceAlert
                            title="Reset form?"
                            description="This will clear all fields and the saved draft."
                            confirmLabel="Reset"
                            onConfirm={newInvoice}
                        >
                            <BaseButton
                                variant="destructive"
                                tooltipLabel="Reset entire form"
                                disabled={invoicePdfLoading}
                            >
                                <RotateCcw/>
                                Reset Form
                            </BaseButton>
                        </NewInvoiceAlert>

                        {/* Generate pdf button */}
                        <BaseButton
                            type="submit"
                            tooltipLabel="Generate your invoice"
                            loading={invoicePdfLoading}
                            loadingText="Generating your invoice"
                        >
                            <FileInput/>
                            {_t("actions.generatePdf")}
                        </BaseButton>

                        {/* Send WhatsApp button */}
                        <BaseButton
                            className="bg-green-600 hover:bg-green-700 text-white"
                            variant="secondary"
                            tooltipLabel="Send invoice via WhatsApp"
                            disabled={invoicePdfLoading}
                        >
                            <Img src={WhatsAppIcon.src} alt="WhatsApp" className="w-4 h-4 mr-2"/>
                            Send via WhatsApp
                        </BaseButton>
                    </div>

                    <div className="w-full mt-4">
                        {/* Live preview and Final invoice */}
                        {renderPreview()}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default InvoiceActions;