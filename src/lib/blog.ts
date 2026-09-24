import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

const postsDirectory = path.join(process.cwd(), 'src/content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  author: string;
  coverImage?: string;
  category: string;
}

export async function getSortedPostsData() {
  // Get file names under /src/content/blog
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get slug
    const slug = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the slug
    return {
      slug,
      ...(matterResult.data as {
        title: string;
        date: string;
        excerpt: string;
        author: string;
        category: string;
        coverImage?: string;
      }),
    };
  });

  // Sort posts by date
  const sortedPosts = allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });

  // Dynamically map dates to 2 months ago, staggered by 5 days per post
  return sortedPosts.map((post, index) => {
    const currentYear = new Date().getFullYear().toString();
    const dynamicTitle = (post.title || '').replace(/\b20\d{2}\b/g, currentYear);

    const dateObj = new Date();
    dateObj.setMonth(dateObj.getMonth() - 2);
    dateObj.setDate(dateObj.getDate() - (index * 5)); // 5 days interval between posts
    
    const dynamicDate = dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return {
      ...post,
      title: dynamicTitle,
      date: dynamicDate
    };
  });
}

export async function getPostData(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    throw new Error('Post not found');
  }
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use marked to convert markdown into HTML string
  const contentHtml = await marked(matterResult.content);

  // Get the dynamically adjusted title and date from the sorted array
  const sortedPosts = await getSortedPostsData();
  const postInfo = sortedPosts.find(p => p.slug === slug);

  // Combine the data with the slug and contentHtml
  return {
    slug,
    contentHtml,
    ...(matterResult.data as {
      title: string;
      excerpt: string;
      author: string;
      category: string;
      coverImage?: string;
      date: string;
    }),
    title: postInfo?.title || matterResult.data.title,
    date: postInfo?.date || matterResult.data.date,
  };
}
