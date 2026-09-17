import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/articles";
import { routes } from "@/lib/routes";

export function ArticleCard({ article, large = false }: { article: Article; large?: boolean }) {
  return (
    <article className="group flex flex-col">
      <Link href={routes.article(article.slug)} className="block">
        <div className={`relative overflow-hidden rounded-card bg-sand ${large ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
          {article.coverImage ? (
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              sizes={large ? "(max-width: 1024px) 100vw, 60vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : null}
        </div>
      </Link>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
        {article.category} <span className="mx-1.5 text-muted-soft">·</span>
        <span className="font-medium normal-case tracking-normal text-muted">{article.readMinutes} min läsning</span>
      </p>
      <h3 className={`mt-2 font-display font-medium leading-snug ${large ? "text-2xl sm:text-3xl" : "text-lg"}`}>
        <Link href={routes.article(article.slug)} className="hover:underline">
          {article.title}
        </Link>
      </h3>
      <p className={`mt-2 text-sm leading-relaxed text-muted ${large ? "line-clamp-3" : "line-clamp-2"}`}>{article.excerpt}</p>
    </article>
  );
}
