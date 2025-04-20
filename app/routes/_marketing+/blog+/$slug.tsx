import { useLoaderData } from "react-router";
import type { Route } from "./+types/$slug";

export async function loader({ params }: Route.LoaderArgs) {
  const response = await fetch(
    `${process.env.WORDPRESS_API_URL}/wp-json/wp/v2/posts?slug=${params.slug}&_embed`
  );

  const posts = await response.json();

  if (!posts.length) throw new Response("Post not found", { status: 404 });

  const post = posts[0];
  return { post };
}

export default function Post() {
  const { post } = useLoaderData<typeof loader>();

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <article className="relative isolate flex flex-col gap-8">
            <div className="relative aspect-[2/1] w-full">
              <img
                alt={post._embedded["wp:featuredmedia"][0].alt_text}
                src={post._embedded["wp:featuredmedia"][0].source_url}
                className="absolute inset-0 size-full rounded-2xl bg-gray-50 object-cover"
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
            </div>

            <div>
              <div className="flex items-center gap-x-4 text-xs">
                <time dateTime={post.date} className="text-gray-500">
                  {new Date(post.date).toLocaleDateString()}
                </time>
                <span className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600">
                  {post._embedded["wp:term"][0][0].name}
                </span>
              </div>

              <h1 className="mt-3 text-3xl font-semibold text-gray-900">
                {post.title.rendered}
              </h1>

              <div className="mt-6 flex border-t border-gray-900/5 pt-6">
                <div className="relative flex items-center gap-x-4">
                  <img
                    alt={`${post._embedded.author[0].name}'s avatar`}
                    src={post._embedded.author[0].avatar_urls["96"]}
                    className="size-10 rounded-full bg-gray-50"
                  />
                  <div className="text-sm/6">
                    <p className="font-semibold text-gray-900">
                      {post._embedded.author[0].name}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="mt-8 text-lg/relaxed text-gray-600 prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content.rendered }}
              />
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
