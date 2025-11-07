"use client";

import React, {useState} from "react";

// ShadCn
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

// Components
import {BaseButton} from "@/app/components";

// Helpers
import {isPhoneNumber} from "@/lib/helpers";

type SendWhatsappInvoiceModalProps = {
    sendWhatsappInvoice: (email: string) => Promise<void>;
    children: React.ReactNode;
};

const SendWhatsappInvoiceModal = ({
                                 sendWhatsappInvoice,
                                 children,
                             }: SendWhatsappInvoiceModalProps) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const errorMessage = "Please enter a valid phone number";

    const handleSendPdf = () => {
        setLoading(true);

        if (!isPhoneNumber(phone)) {
            setLoading(false);
            setError(errorMessage);
        }

        sendWhatsappInvoice(phone).finally(() => {
            setError("");
            setLoading(false);
            setPhone("");
            setOpen(false);
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Send to email</DialogTitle>
                    <DialogDescription>
                        Please specify the phone number for invoice delivery.
                    </DialogDescription>
                </DialogHeader>
                <Label>Phone Number</Label>
                <Input
                    type="text"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                ></Input>

                {!loading && error && (
                    <small style={{color: "red"}}>{error}</small>
                )}

                <BaseButton
                    tooltipLabel="Send invoice as WhatsApp message"
                    loading={loading}
                    loadingText="Sending message"
                    onClick={handleSendPdf}
                >
                    Send via WhatsApp
                </BaseButton>
            </DialogContent>
        </Dialog>
    );
};

export default SendWhatsappInvoiceModal;
