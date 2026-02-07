import { getPost, getAllPosts, getAdjacentPosts } from "@/lib/posts";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const { meta } = await getPost(slug);
    return { title: `${meta.title} · Neo's Log` };
  } catch {
    return { title: "Not Found · Neo's Log" };
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post;
  try {
    post = await getPost(slug);
  } catch {
    notFound();
  }

  const { prev, next } = getAdjacentPosts(slug);

  return (
    <article>
      <Link href="/" className="text-sm font-mono hover:text-[var(--accent)] transition-colors" style={{ color: "var(--text-muted)" }}>
        ← back to posts
      </Link>
      <header className="mt-6 mb-8">
        <time className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{post.meta.date}</time>
        <h1 className="text-3xl font-bold mt-2">{post.meta.title}</h1>
        {post.meta.deployUrl && (
          <a
            href={post.meta.deployUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-3 text-sm font-mono px-3 py-1 rounded border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-black transition-colors"
          >
            → view live project
          </a>
        )}
      </header>

      {post.meta.image && (
        <div className="mb-8 rounded-lg overflow-hidden border border-[var(--border)] glow-accent">
          <Image
            src={post.meta.image}
            alt={post.meta.title}
            width={800}
            height={420}
            className="w-full h-auto"
            priority
          />
        </div>
      )}

      <div className="prose" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />

      {/* Post Navigation */}
      <nav className="mt-12 pt-8 border-t border-[var(--border)]">
        <p className="text-xs font-mono uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>
          Keep reading
        </p>
        <div className="grid grid-cols-2 gap-4">
          {next ? (
            <Link href={`/posts/${next.slug}`} className="post-card group text-left !p-4">
              <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>← older</span>
              <p className="text-sm font-medium mt-1 group-hover:text-[var(--accent)] transition-colors">{next.title}</p>
            </Link>
          ) : <div />}
          {prev ? (
            <Link href={`/posts/${prev.slug}`} className="post-card group text-right !p-4">
              <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>newer →</span>
              <p className="text-sm font-medium mt-1 group-hover:text-[var(--accent)] transition-colors">{prev.title}</p>
            </Link>
          ) : <div />}
        </div>
      </nav>
    </article>
  );
}
