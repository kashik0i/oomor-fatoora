// Types
import {InvoiceType, SignatureColor, SignatureFont} from "@/types";
import {InvoiceSchema} from "@/lib/schemas";

/**
 * Environment
 */
export const ENV = process.env.NODE_ENV;

/**
 * Websites
 */
export const BASE_URL = "https://fatoora.oomor.com";
export const OG_AUTHOR_WEBSITE = "https://aliabb.vercel.app";
export const OG_AUTHOR_GITHUB = "https://github.com/al1abb";
export const AUTHOR_WEBSITE = "https://www.badawy.dev";
export const AUTHOR_GITHUB = "https://github.com/kashik0i";

/**
 * API endpoints
 */
export const GENERATE_PDF_API = "/api/invoice/generate";
export const SEND_PDF_API = "/api/invoice/send";
export const EXPORT_INVOICE_API = "/api/invoice/export";

/**
 * External API endpoints
 */
export const CURRENCIES_API =
    "https://openexchangerates.org/api/currencies.json";

/**
 * Local storage
 */
export const LOCAL_STORAGE_INVOICE_DRAFT_KEY = "fatoora:invoiceDraft";

/**
 * Tailwind
 */
export const TAILWIND_CDN =
    "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";

/**
 * Google
 */
export const GOOGLE_SC_VERIFICATION = process.env.GOOGLE_SC_VERIFICATION;

/**
 * Nodemailer
 */
export const NODEMAILER_EMAIL = process.env.NODEMAILER_EMAIL;
export const NODEMAILER_PW = process.env.NODEMAILER_PW;

/**
 * I18N
 */
export const LOCALES = [
    {code: "ar", name: "العربية"},
    {code: "en", name: "English"},
    // { code: "de", name: "Deutsch" },
    // { code: "it", name: "Italiano" },
    // { code: "es", name: "Español" },
    // { code: "ca", name: "Català" },
    // { code: "fr", name: "Français" },
    // { code: "pl", name: "Polish" },
    // { code: "pt-BR", name: "Português (Brasil)" },
    // { code: "tr", name: "Türkçe" },
    // { code: "zh-CN", name: "简体中文" },
    // { code: "ja", name: "日本語" },
    // { code: "nb-NO", name: "Norwegian (bokmål)" },
    // { code: "nn-NO", name: "Norwegian (nynorsk)" },
];
export const DEFAULT_LOCALE = LOCALES[0].code;

/**
 * Signature variables
 */
export const SIGNATURE_COLORS: SignatureColor[] = [
    {name: "black", label: "Black", color: "rgb(0, 0, 0)"},
    {name: "dark blue", label: "Dark Blue", color: "rgb(0, 0, 128)"},
    {
        name: "crimson",
        label: "Crimson",
        color: "#DC143C",
    },
];

export const SIGNATURE_FONTS: SignatureFont[] = [
    {
        name: "Dancing Script",
        variable: "var(--font-dancing-script)",
    },
    {name: "Parisienne", variable: "var(--font-parisienne)"},
    {
        name: "Great Vibes",
        variable: "var(--font-great-vibes)",
    },
    {
        name: "Alex Brush",
        variable: "var(--font-alex-brush)",
    },
];

/**
 * Form date options
 */
export const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
};

export const SHORT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
};

/**
 * Form defaults
 */
export const FORM_DEFAULT_VALUES: InvoiceType = {
    exportType: "pdf",
    sender: {
        name: "",
        address: "",
        zipCode: "",
        city: "",
        country: "",
        email: "",
        phone: "",
        customInputs: [],
    },
    receiver: {
        name: "",
        address: "",
        zipCode: "",
        city: "",
        country: "",
        email: "",
        phone: "",
        customInputs: [],
    },
    details: {
        invoiceLogo: "",
        invoiceNumber: "",
        invoiceDate: "",
        dueDate: "",
        items: [
            {
                name: "",
                description: "",
                quantity: 0,
                unitPrice: 0,
                total: 0,
            },
        ],
        currency: "USD",
        language: "English",
        taxDetails: {
            amount: 0,
            amountType: "amount",
            taxID: "",
        },
        discountDetails: {
            amount: 0,
            amountType: "amount",
        },
        shippingDetails: {
            cost: 0,
            costType: "amount",
        },
        paymentInformation: {
            bank: {
                enabled: false,
                bankName: "",
                accountName: "",
                accountNumber: "",
            },
            stripe: {
                enabled: false,
                url: "",
            },
            wallet: {
                enabled: false,
                type: "vodafone",
                phoneNumber: "",
            },
            instapay: {
                enabled: false,
                walletUrl: "",
                bankUrl: "",
                accountUrl: "",
                phoneUrl: "",
            }
        },
        totalAmount: 0,
        purchaseOrderNumber: "",
        subTotal: 0,
        signature: {
            data: "",
        },
        updatedAt: "",
        additionalNotes: "",
        paymentTerms: "",
        totalAmountInWords: "",
        pdfTemplate: 1,
    },
};

/**
 * ? DEV Only
 * Form autofill values for testing
 */
export const FORM_FILL_VALUES: typeof InvoiceSchema._type = {
    sender: {
        name: "John Doe",
        address: "123 Main St",
        zipCode: "12345",
        city: "Anytown",
        country: "USA",
        email: "johndoe@example.com",
        phone: "123-456-7890",
    },
    receiver: {
        name: "Jane Smith",
        address: "456 Elm St",
        zipCode: "54321",
        city: "Other Town",
        country: "Canada",
        email: "janesmith@example.com",
        phone: "987-654-3210",
    },
    details: {
        invoiceLogo: "",
        invoiceNumber: "INV0001",
        invoiceDate: new Date().toLocaleDateString("en-US", DATE_OPTIONS),
        dueDate: new Date().toLocaleDateString("en-US", DATE_OPTIONS),
        items: [
            {
                name: "Product 1",
                description: "Description of Product 1",
                quantity: 4,
                unitPrice: 50,
                total: 200,
            },
            {
                name: "Product 2",
                description: "Description of Product 2",
                quantity: 5,
                unitPrice: 50,
                total: 250,
            },
            {
                name: "Product 3",
                description: "Description of Product 3",
                quantity: 5,
                unitPrice: 80,
                total: 400,
            },
        ],
        currency: "USD",
        language: "English",
        taxDetails: {
            amount: 15,
            amountType: "percentage",
            taxID: "987654321",
        },
        discountDetails: {
            amount: 5,
            amountType: "percentage",
        },
        shippingDetails: {
            cost: 5,
            costType: "percentage",
        },
        paymentInformation: {
            bank: {
                enabled: true,
                bankName: "Bank Inc.",
                accountName: "John Doe",
                accountNumber: "445566998877",
            },
            stripe: {
                enabled: true,
                url: "https://stripe.com/pay/invoice/123456",
            },
            wallet: {
                enabled: true,
                type: "vodafone",
                phoneNumber: "+1234567890",
            },
            instapay: {
                enabled: true,
                walletUrl: "https://instapay.com/wallet/123456",
                bankUrl: "https://instapay.com/bank/123456",
                accountUrl: "https://instapay.com/account/123456",
                phoneUrl: "https://instapay.com/phone/123456",
            }
        },
        additionalNotes: "Thank you for your business",
        paymentTerms: "Net 30",
        signature: {
            data: "",
        },
        subTotal: 850,
        totalAmount: 850,
        totalAmountInWords: "Eight Hundred Fifty",
        pdfTemplate: 1,
    },
    exportType: 'whatsapp'
};
