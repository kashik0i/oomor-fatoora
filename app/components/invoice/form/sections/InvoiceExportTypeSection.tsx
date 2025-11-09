"use client";

import React from 'react';
import {useFormContext, useWatch} from "react-hook-form";
import {useTranslationContext} from "@/contexts/TranslationContext";

import {Subheading} from "@/app/components";
const InvoiceExportTypeSection: React.FC = () => {
    const {control} = useFormContext();
    const {_t} = useTranslationContext();

    const { setValue } = useFormContext();

    const exportType = useWatch({
        name: "exportType",
        control,
    });

    return (
        <div className="invoice-export-type-section">
            <Subheading>{_t("form.steps.exportType.heading")}:</Subheading>
            <div className="flex items-center space-x-4">
                {['pdf','csv','whatsapp','json'].map((type) => (
                    <div
                        key={type}
                        className={`cursor-pointer p-4 border-2 rounded-lg flex flex-col items-center justify-center w-28 h-28 transition-all duration-200 ease-in-out ${
                            exportType === type
                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900 dark:border-indigo-400 shadow-md'
                                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => setValue("exportType", type)}
                    >
                        <span className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                            {_t(`form.steps.exportType.${type}`)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InvoiceExportTypeSection;
