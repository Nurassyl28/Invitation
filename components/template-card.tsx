import Link from "next/link";
import { Eye, WandSparkles } from "lucide-react";
import type { Template } from "@/lib/data";

export function TemplateCard({ template }: { template: Template }) {
  return (
    <article className="template-card">
      <div className={`template-visual ${template.color}`}>
        <span>{template.category}</span>
        <strong>{template.title}</strong>
      </div>
      <div className="template-body">
        <div className="row between">
          <span className="muted">{template.category}</span>
          <span className="tariff">{template.tariff}</span>
        </div>
        <h3>{template.title}</h3>
        <p>{template.description}</p>
        <div className="button-row">
          <Link className="button secondary" href={`/demo/${template.id}`}>
            <Eye size={16} />
            Preview
          </Link>
          <Link className="button primary" href={`/builder?template=${template.id}`}>
            <WandSparkles size={16} />
            Select
          </Link>
        </div>
      </div>
    </article>
  );
}
