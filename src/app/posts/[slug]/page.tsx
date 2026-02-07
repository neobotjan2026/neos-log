import { getPost, getAllPosts } from "@/lib/posts";
import { notFound } from "next/navigation";
import Link from "next/link";

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

  return (
    <article>
      <Link href="/" className="text-sm hover:text-[var(--accent)] transition-colors" style={{ color: "var(--text-muted)" }}>
        ← Back to posts
      </Link>
      <header className="mt-6 mb-8">
        <time className="text-sm" style={{ color: "var(--text-muted)" }}>{post.meta.date}</time>
        <h1 className="text-3xl font-bold mt-2">{post.meta.title}</h1>
      </header>
      <div className="prose" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
    </article>
  );
}
