"use client";

// Components
import {
    FormInput,
    Subheading,
    FormCheckbox,
    FormSelect,
} from "@/app/components";

// Contexts
import { useTranslationContext } from "@/contexts/TranslationContext";
import { useFormContext } from "react-hook-form";

const PaymentInformation = () => {
    const { _t } = useTranslationContext();
    const { watch } = useFormContext();

    const bankEnabled = watch("details.paymentInformation.bank.enabled");
    const stripeEnabled = watch("details.paymentInformation.stripe.enabled");
    const walletEnabled = watch("details.paymentInformation.wallet.enabled");
    const instapayEnabled = watch("details.paymentInformation.instapay.enabled");

    return (
        <section>
            <Subheading>{_t("form.steps.paymentInfo.heading")}:</Subheading>
            <div className="flex flex-col gap-4 mt-5">
                {/* Bank Details */}
                <details className="p-4 border rounded-lg" open>
                    <summary className="font-semibold cursor-pointer flex items-center gap-4">
                        <FormCheckbox
                            name="details.paymentInformation.bank.enabled"
                            label={_t("form.steps.paymentInfo.bank.heading")}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </summary>
                    {bankEnabled && (
                        <div className="flex flex-wrap gap-10 mt-5">
                            <FormInput
                                name="details.paymentInformation.bank.bankName"
                                label={_t("form.steps.paymentInfo.bankName")}
                                vertical
                            />
                            <FormInput
                                name="details.paymentInformation.bank.accountName"
                                label={_t("form.steps.paymentInfo.accountName")}
                                vertical
                            />
                            <FormInput
                                name="details.paymentInformation.bank.accountNumber"
                                label={_t("form.steps.paymentInfo.accountNumber")}
                                vertical
                            />
                        </div>
                    )}
                </details>

                {/* Stripe */}
                <details className="p-4 border rounded-lg">
                    <summary className="font-semibold cursor-pointer flex items-center gap-4">
                        <FormCheckbox
                            name="details.paymentInformation.stripe.enabled"
                            label={_t("form.steps.paymentInfo.stripe.heading")}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </summary>
                    {stripeEnabled && (
                        <div className="mt-5">
                            <FormInput
                                name="details.paymentInformation.stripe.url"
                                label={_t("form.steps.paymentInfo.stripe.url")}
                                vertical
                            />
                        </div>
                    )}
                </details>

                {/* Wallet */}
                <details className="p-4 border rounded-lg">
                    <summary className="font-semibold cursor-pointer flex items-center gap-4">
                        <FormCheckbox
                            name="details.paymentInformation.wallet.enabled"
                            label={_t("form.steps.paymentInfo.wallet.heading")}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </summary>
                    {walletEnabled && (
                        <div className="flex flex-wrap gap-10 mt-5">
                            <FormSelect
                                name="details.paymentInformation.wallet.type"
                                label={_t("form.steps.paymentInfo.wallet.type")}
                                options={[
                                    { label: "Vodafone Cash", value: "vodafone" },
                                    { label: "Etisalat Cash", value: "etisalat" },
                                ]}
                                vertical
                            />
                            <FormInput
                                name="details.paymentInformation.wallet.phoneNumber"
                                label={_t("form.steps.paymentInfo.wallet.phoneNumber")}
                                vertical
                            />
                        </div>
                    )}
                </details>

                {/* Instapay */}
                <details className="p-4 border rounded-lg">
                    <summary className="font-semibold cursor-pointer flex items-center gap-4">
                        <FormCheckbox
                            name="details.paymentInformation.instapay.enabled"
                            label={_t("form.steps.paymentInfo.instapay.heading")}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </summary>
                    {instapayEnabled && (
                        <div className="flex flex-wrap gap-10 mt-5">
                            <FormInput
                                name="details.paymentInformation.instapay.walletUrl"
                                label={_t("form.steps.paymentInfo.instapay.walletUrl")}
                                vertical
                            />
                            <FormInput
                                name="details.paymentInformation.instapay.bankUrl"
                                label={_t("form.steps.paymentInfo.instapay.bankUrl")}
                                vertical
                            />
                            <FormInput
                                name="details.paymentInformation.instapay.accountUrl"
                                label={_t("form.steps.paymentInfo.instapay.accountUrl")}
                                vertical
                            />
                            <FormInput
                                name="details.paymentInformation.instapay.phoneUrl"
                                label={_t("form.steps.paymentInfo.instapay.phoneUrl")}
                                vertical
                            />
                        </div>
                    )}
                </details>
            </div>
        </section>
    );
};

export default PaymentInformation;
