const SEARCHABLE_COLUMNS = {
  brand: "string",
  name: "string",
  category_id: "number",
  regular_price: "number",
  discount_price: "number",
  stock: "number",
  rating: "number",
};
export default function buildSearchWhere(searchQuery) {
  if (!searchQuery || typeof searchQuery !== "object") return {};

  const where = {};

  for (const [column, rawValue] of Object.entries(searchQuery)) {
    if (!Object.hasOwn(SEARCHABLE_COLUMNS, column)) continue;

    const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;
    if (value === undefined || value === "") continue;

    const type = SEARCHABLE_COLUMNS[column];

    if (type === "string") {
      where[column] = { [Op.iLike]: `%${value}%` };
    } else {
      const num = Number(value);
      if (!Number.isNaN(num)) where[column] = num;
      // kalau bukan angka valid, kolom ini di-skip (gak dianggap error)
    }
  }

  return where;
}
