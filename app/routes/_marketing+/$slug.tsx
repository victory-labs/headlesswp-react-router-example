import { useLoaderData } from "react-router";
import type { Route } from "./+types/$slug";

export async function loader({ params }: Route.LoaderArgs) {
  const response = await fetch(
    `${process.env.WORDPRESS_API_URL}/wp-json/wp/v2/pages?slug=${params.slug}&_embed`
  );

  const pages = await response.json();

  // WP returns an array when querying by slug, get the first match
  if (!pages.length) throw new Response("Post not found", { status: 404 });

  const page = pages[0];
  return { page };
}

export default function Post() {
  const { page } = useLoaderData<typeof loader>();
  const author = page._embedded?.author?.[0];

  return (
    <div className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <article className="relative isolate flex flex-col gap-8">
            <div>
              <h1 className="mt-3 text-3xl font-semibold text-gray-900">
                {page.title.rendered}
              </h1>

              <div
                className="mt-8 text-lg/relaxed text-gray-600 prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: page.content.rendered }}
              />
            </div>

            {author && (
              <div className="mt-6 flex border-t border-gray-900/5 pt-6">
                <div className="relative flex items-center gap-x-4">
                  <img
                    alt={`${author.name}'s avatar`}
                    src={author.avatar_urls["96"]}
                    className="size-10 rounded-full bg-gray-50"
                  />
                  <div className="text-sm/6">
                    <p className="font-semibold text-gray-900">{author.name}</p>
                  </div>
                </div>
              </div>
            )}
          </article>
        </div>
      </div>
    </div>
  );
}
