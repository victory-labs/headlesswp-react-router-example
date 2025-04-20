import { Link, useLoaderData } from "react-router";
import type { Route } from "./+types/index";

interface WPPost {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  _embedded: {
    author: Array<{
      name: string;
      link: string;
      avatar_urls: { [key: string]: string };
    }>;
    "wp:featuredmedia": Array<{ source_url: string; alt_text: string }>;
    "wp:term": Array<Array<{ name: string }>>;
  };
}

export const meta: Route.MetaFunction = () => {
  return [{ title: "HeadlessWP - React Router Example" }];
};

export async function loader({}: Route.LoaderArgs) {
  const response = await fetch(
    `${process.env.WORDPRESS_API_URL}/wp-json/wp/v2/posts?_embed`
  );
  const posts = await response.json();
  return { posts };
}

export default function IndexRoute() {
  const { posts } = useLoaderData<typeof loader>();

  return (
    <div className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <h2 className="text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Blog
          </h2>
          <p className="mt-2 text-lg/8 text-gray-600">
            Posts from your HeadlessWP plugin powered site.
          </p>
          <div className="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
            {posts.map((post: WPPost) => (
              <article
                key={post.id}
                className="relative isolate flex flex-col gap-8 lg:flex-row"
              >
                <Link to={`/blog/${post.slug}`}>
                  <div className="relative aspect-video sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0">
                    <img
                      alt={post._embedded["wp:featuredmedia"][0].alt_text}
                      src={post._embedded["wp:featuredmedia"][0].source_url}
                      className="absolute inset-0 size-full rounded-2xl bg-gray-50 object-cover duration-200 ease-linear hover:scale-105 "
                    />
                  </div>
                </Link>
                <div>
                  <div className="flex items-center gap-x-4 text-xs">
                    <time dateTime={post.date} className="text-gray-500">
                      {new Date(post.date).toLocaleDateString()}
                    </time>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                    >
                      {post._embedded["wp:term"][0][0].name}
                    </Link>
                  </div>
                  <div className="group relative max-w-xl">
                    <h3 className="mt-3 text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600">
                      <Link to={`/blog/${post.slug}`}>
                        <span className="absolute inset-0" />
                        {post.title.rendered}
                      </Link>
                    </h3>
                    <div
                      className="mt-5 text-sm/6 text-gray-600"
                      dangerouslySetInnerHTML={{
                        __html: post.excerpt.rendered,
                      }}
                    />
                  </div>
                  <div className="mt-6 flex border-t border-gray-900/5 pt-6">
                    <div className="relative flex items-center gap-x-4">
                      <img
                        alt={`${post._embedded.author[0].name}'s avatar`}
                        src={post._embedded.author[0].avatar_urls["96"]}
                        className="size-10 rounded-full bg-gray-50"
                      />
                      <div className="text-sm/6">
                        <p className="font-semibold text-gray-900">
                          <Link to={post._embedded.author[0].link}>
                            <span className="absolute inset-0" />
                            {post._embedded.author[0].name}
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
