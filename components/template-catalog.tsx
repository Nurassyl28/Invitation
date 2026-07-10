"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { TemplateCard } from "@/components/template-card";
import { categories, templates } from "@/lib/data";

const tariffs = ["Все", "Free", "Standard", "Premium", "VIP"];

export function TemplateCatalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Все");
  const [tariff, setTariff] = useState("Все");

  const filteredTemplates = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return templates.filter((template) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [template.title, template.category, template.tariff, ...template.tags]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesCategory = category === "Все" || template.category === category;
      const matchesTariff = tariff === "Все" || template.tariff === tariff;

      return matchesQuery && matchesCategory && matchesTariff;
    });
  }, [category, query, tariff]);

  return (
    <section className="catalog-layout">
      <aside className="sidebar">
        <label className="field">
          <span>Поиск</span>
          <span className="input-with-icon">
            <Search size={17} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Свадьба, VIP, gallery"
            />
          </span>
        </label>

        <div className="filter-block">
          <h2>Категория</h2>
          <button className={category === "Все" ? "is-active" : ""} onClick={() => setCategory("Все")} type="button">
            Все
          </button>
          {categories.map((item) => (
            <button className={category === item ? "is-active" : ""} key={item} onClick={() => setCategory(item)} type="button">
              {item}
            </button>
          ))}
        </div>

        <div className="filter-block">
          <h2>Тариф</h2>
          {tariffs.map((item) => (
            <button className={tariff === item ? "is-active" : ""} key={item} onClick={() => setTariff(item)} type="button">
              {item}
            </button>
          ))}
        </div>
      </aside>

      <main className="catalog-main">
        <div className="toolbar">
          <strong>{filteredTemplates.length} шаблонов</strong>
          <span>Фильтры работают на клиенте, дальше данные можно брать из PostgreSQL.</span>
        </div>
        {filteredTemplates.length ? (
          <div className="template-grid">
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        ) : (
          <section className="empty-state compact-empty">
            <span className="eyebrow">Новый старт</span>
            <h2>Каталог пока пустой</h2>
            <p>Старые шаблоны удалены. Теперь можно добавлять новые дизайны по одному и сразу проверять качество.</p>
          </section>
        )}
      </main>
    </section>
  );
}
