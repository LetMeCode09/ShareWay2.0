import { t } from "../i18n/en";

export default function Loading({ text }) {
    return <div className="state">{text || t.loading}</div>;
}