import { useState } from "react";
import { Bot, BadgeCheck, ChevronRight, FileText, FlaskConical } from "lucide-react";
import { materialsCopy } from "../content.js";
import { cn, Chip, Empty } from "./ui.jsx";

const TYPE_ICON = {
  笔记: FileText,
  练习: FlaskConical,
};

export default function MaterialsTab({ materials, onOpen }) {
  const [subject, setSubject] = useState("全部");

  const visible =
    subject === "全部" ? materials : materials.filter((item) => item.subject === subject);

  return (
    <div className="px-4 pb-6">
      <div className="mt-4">
        <h1 className="text-[20px] font-semibold tracking-tight">{materialsCopy.title}</h1>
        <p className="mt-1 text-[12.5px] leading-relaxed text-ink/55">{materialsCopy.subtitle}</p>
      </div>

      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
        {materialsCopy.subjects.map((item) => (
          <Chip key={item} active={item === subject} onClick={() => setSubject(item)}>
            {item}
          </Chip>
        ))}
      </div>

      <div className="mt-4 space-y-2.5">
        {visible.length === 0 ? (
          <Empty title={materialsCopy.empty} />
        ) : (
          visible.map((material) => {
            const Icon = TYPE_ICON[material.type] || FileText;
            return (
              <article
                key={material.id}
                className="card-shadow rounded-2xl bg-white p-3.5 ring-1 ring-ink/5"
              >
                <button
                  type="button"
                  onClick={() => onOpen(material, { ai: false })}
                  className="block w-full text-left"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "mt-0.5 rounded-xl p-2",
                        material.subject === "MTH"
                          ? "bg-teal-50 text-brand"
                          : material.subject === "EAP"
                            ? "bg-indigo-50 text-indigo-600"
                            : "bg-amber-50 text-accent"
                      )}
                    >
                      <Icon size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="rounded bg-ink/5 px-1.5 py-0.5 text-[10.5px] font-medium text-ink/55">
                          {material.subject}
                        </span>
                        <span className="text-[10.5px] text-ink/40">{material.type}</span>
                        {material.verified ? (
                          <span className="inline-flex items-center gap-0.5 text-[10.5px] text-brand">
                            <BadgeCheck size={11} /> {materialsCopy.verified}
                          </span>
                        ) : (
                          <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10.5px] text-accent">
                            {materialsCopy.pending}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-1 text-[14px] font-semibold leading-snug">
                        {material.title}
                      </h3>
                      <p className="mt-1 text-[11.5px] text-ink/45">
                        {material.author} · {material.updated}
                      </p>
                    </div>
                    <ChevronRight size={16} className="mt-2 shrink-0 text-ink/25" />
                  </div>
                </button>
                <div className="mt-2.5 flex items-center border-t border-ink/5 pt-2.5">
                  <button
                    type="button"
                    onClick={() => onOpen(material, { ai: true })}
                    className="inline-flex items-center gap-1 rounded-lg bg-ink px-2.5 py-1.5 text-[11.5px] font-medium text-white active:scale-95"
                  >
                    <Bot size={12} /> {materialsCopy.aiButton}
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpen(material, { ai: false })}
                    className="ml-auto text-[11.5px] text-ink/45"
                  >
                    查看内容
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>

      <p className="mt-4 rounded-xl bg-white/60 px-3 py-2.5 text-[11px] leading-relaxed text-ink/40">
        {materialsCopy.disclaimer}
      </p>
    </div>
  );
}
