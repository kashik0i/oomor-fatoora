"use client";

import { useTranslationContext } from "@/contexts/TranslationContext";

// Variables
import {AUTHOR_GITHUB, OG_AUTHOR_GITHUB} from "@/lib/variables";

const BaseFooter = () => {
    const { _t } = useTranslationContext();

    return (
        <footer className="container py-10 text-center text-sm text-gray-500">
            <p>
                {_t("footer.developedBy")}{" "}
                <a
                    href={OG_AUTHOR_GITHUB}
                    target="_blank"
                    style={{ textDecoration: "underline" }}
                >
                    Ali Abbasov
                </a>
                 /
                <a
                    href={AUTHOR_GITHUB}
                    target="_blank"
                    style={{ textDecoration: "underline" }}
                >
                    Amr Badawy
                </a>
            </p>
        </footer>
    );
};

export default BaseFooter;
