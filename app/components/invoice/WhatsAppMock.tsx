"use client";

import React from "react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useTheme} from "next-themes";
import WhatsappBgLight from "@/public/assets/img/whatsapp-bg-light.png";
import WhatsappBgDark from "@/public/assets/img/whatsapp-bg-dark.png";
import {useFormContext} from "react-hook-form";
import {InvoiceType} from "@/types";
import {useDebounce} from "use-debounce";


const WhatsAppMock: React.FC = () => {
    const {watch} = useFormContext<InvoiceType>();

    const [debouncedWatch] = useDebounce(watch, 1000);
    const formValues = debouncedWatch();
    const {theme} = useTheme();

    const backgroundImage = theme === 'dark'
        ? WhatsappBgDark
        : WhatsappBgLight;

    const companyName = formValues.sender.name || "My Company";
    const clientName = formValues.receiver.name || "Client Name";
    const invoiceNumber = formValues.details.invoiceNumber || "0001";
    const issueDate = formValues.details.invoiceDate ? new Date(formValues.details.invoiceDate).toLocaleDateString() : "2024-01-01";
    const dueDate = formValues.details.dueDate ? new Date(formValues.details.dueDate).toLocaleDateString() : "2024-01-15";
    const totalAmount = formValues.details.totalAmount || 0;
    const currency = formValues.details.currency || "USD";
    const notes = formValues.details.additionalNotes || "";
    const items = formValues.details.items || [];
    const paymentInfo = formValues.details.paymentInformation;

    return (
        <div className="flex justify-center items-center p-4">
            <div
                className="w-[320px] h-[600px] bg-white dark:bg-black rounded-3xl border-4 border-gray-400 dark:border-gray-600 shadow-2xl overflow-hidden">
                {/* Screen Content */}
                <div
                    className="w-full h-full bg-cover bg-center"
                    style={{backgroundImage: `url(${backgroundImage.src})`}}
                >
                    {/* Top Bar */}
                    <div className="bg-[#005e54] dark:bg-[#2a3942] text-white p-2 flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage alt={companyName}/>
                            <AvatarFallback>{companyName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-semibold">{companyName}</span>
                    </div>

                    {/* Chat Area */}
                    <div className="p-3 flex flex-col gap-2">
                        {/* Date Chip */}
                        <div className="flex justify-center my-2">
                            <span
                                className="bg-[#e1f2fb] dark:bg-[#1f2c34] text-xs text-gray-800 dark:text-gray-300 rounded-md px-2 py-1">
                                TODAY
                            </span>
                        </div>

                        {/* Message Bubble */}
                        <div className="max-w-[80%] self-start">
                            <div className="bg-white dark:bg-[#202c33] rounded-lg p-2 shadow">
                                <p className="text-sm text-black dark:text-white">
                                    Hi {clientName}, here is your invoice {invoiceNumber}:
                                </p>
                                <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Issue Date: {issueDate}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Due Date: {dueDate}</p>

                                {items.length > 0 && (
                                    <>
                                        <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                                        <p className="text-xs font-bold text-black dark:text-white mb-1">Items:</p>
                                        <div
                                            className="grid grid-cols-[2fr,1fr,1fr] gap-x-1 text-xs text-gray-600 dark:text-gray-400">
                                            <span className="font-semibold">Name</span>
                                            <span className="font-semibold text-center">Qty</span>
                                            <span className="font-semibold text-right">Price</span>
                                            {items.map((item, index) => (
                                                <React.Fragment key={index}>
                                                    <span>{item.name}</span>
                                                    <span className="text-center">{item.quantity}</span>
                                                    <span className="text-right">{new Intl.NumberFormat('en-US', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    }).format(item.unitPrice)}</span>
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {paymentInfo && (paymentInfo.bank?.enabled || paymentInfo.stripe?.enabled || paymentInfo.wallet?.enabled || paymentInfo.instapay?.enabled) && (
                                    <>
                                        <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                                        <p className="text-xs font-bold text-black dark:text-white mt-1 mb-1">Payment
                                            Info:</p>
                                        {paymentInfo.bank?.enabled && (
                                            <>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">Bank: {paymentInfo.bank.bankName}</p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">Account
                                                    Name: {paymentInfo.bank.accountName}</p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">Account
                                                    No: {paymentInfo.bank.accountNumber}</p>
                                            </>
                                        )}
                                        {paymentInfo.stripe?.enabled && (
                                            <p className="text-xs text-gray-600 dark:text-gray-400">Stripe: {paymentInfo.stripe.url}</p>
                                        )}
                                        {paymentInfo.wallet?.enabled && (
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {paymentInfo.wallet.type} Wallet: {paymentInfo.wallet.phoneNumber}
                                            </p>
                                        )}
                                        {paymentInfo.instapay?.enabled && (
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                Instapay: {paymentInfo.instapay.walletUrl || paymentInfo.instapay.bankUrl || paymentInfo.instapay.accountUrl || paymentInfo.instapay.phoneUrl}
                                            </p>
                                        )}
                                    </>
                                )}

                                <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                                <p className="text-sm font-bold text-black dark:text-white mt-1">
                                    Total: {new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency
                                }).format(totalAmount)}
                                </p>
                                {notes && (
                                    <>
                                        <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                                        <p className="text-xs italic text-gray-600 dark:text-gray-400">{notes}</p>
                                    </>
                                )}
                                <p className="text-xs text-right text-gray-500 dark:text-gray-400 mt-1">10:30 AM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhatsAppMock;
