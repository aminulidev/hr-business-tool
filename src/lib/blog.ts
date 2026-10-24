import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const postsDirectory = path.join(process.cwd(), 'src/content/blog');

interface PostFrontmatter {
  title: string;
  /** Publish date from the markdown frontmatter, YYYY-MM-DD */
  date: string;
  excerpt: string;
  author: string;
  category: string;
  coverImage?: string;
}

export interface BlogPostSummary extends PostFrontmatter {
  slug: string;
  /** Human-readable date, e.g. "September 2, 2026" */
  dateLabel: string;
}

export interface BlogPost extends BlogPostSummary {
  contentHtml: string;
}

/** Format a YYYY-MM-DD frontmatter date for display. Falls back to the raw string. */
export function formatPostDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

function readFrontmatter(fileName: string): BlogPostSummary {
  const slug = fileName.replace(/\.md$/, '');
  const fileContents = fs.readFileSync(path.join(postsDirectory, fileName), 'utf8');
  const data = matter(fileContents).data as PostFrontmatter;
  return { slug, ...data, dateLabel: formatPostDate(data.date) };
}

/** All posts, newest first, using the real dates from each file's frontmatter. */
export async function getSortedPostsData(): Promise<BlogPostSummary[]> {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  return fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith('.md'))
    .map(readFrontmatter)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export async function getPostData(slug: string): Promise<BlogPost> {
  const fileName = `${slug}.md`;
  const fullPath = path.join(postsDirectory, fileName);
  if (!fs.existsSync(fullPath)) {
    throw new Error('Post not found');
  }
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  const contentHtml = await marked(matterResult.content);
  const data = matterResult.data as PostFrontmatter;

  return {
    slug,
    ...data,
    dateLabel: formatPostDate(data.date),
    contentHtml,
  };
}
