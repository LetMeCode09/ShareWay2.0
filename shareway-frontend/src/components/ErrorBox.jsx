import { t } from "../i18n/en";

export default function ErrorBox({ error, onRetry }) {
    const msg =
        error?.response?.data?.message ||
        error?.message ||
        t.error;

    return (
        <div className="error">
        <strong>{t.error}:</strong> {msg}
        {onRetry && (
            <button onClick={onRetry} style={{ marginLeft: 12 }}>
            {t.retry}
            </button>
        )}
        </div>
    );
}