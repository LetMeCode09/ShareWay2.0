import { t } from "../i18n/en";

export default function SearchSortBar({
    q, setQ,
    sortBy, setSortBy,
    order, setOrder,
    sortOptions = [],
    onRefresh,
}) {
    return (
        <div className="toolbar">
        <input
            placeholder={t.searchPlaceholder}
            value={q}
            onChange={(e) => setQ(e.target.value)}
        />

        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {t.sortBy}
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            {sortOptions.map((op) => (
                <option key={op.value} value={op.value}>{op.label}</option>
            ))}
            </select>
        </label>

        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {t.order}
            <select value={order} onChange={(e) => setOrder(e.target.value)}>
            <option value="asc">{t.asc}</option>
            <option value="desc">{t.desc}</option>
            </select>
        </label>

        {onRefresh && <button onClick={onRefresh}>{t.refresh}</button>}
        </div>
    );
}