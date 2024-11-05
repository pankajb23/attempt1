import { useTranslation } from "react-i18next";

export default function MainPageOfferDashboardColumns() {
    const { t } = useTranslation();
    const Colums = [
        t("offer.dashboard.column.all"),
        t("offer.dashboard.column.product"),
        t("offer.dashboard.column.cart"),
        t("offer.dashboard.column.post_purchase")
    ]
    return Colums;
}
