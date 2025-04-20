import { Link, Outlet, useLoaderData } from "react-router";
import logoLight from "./logo-light.svg";
import type { Route } from "./+types/index";

interface WPPage {
  id: number;
  slug: string;
  title: { rendered: string };
}

export async function loader({}: Route.LoaderArgs) {
  const response = await fetch(
    `${process.env.WORDPRESS_API_URL}/wp-json/wp/v2/pages?_embed`
  );
  const pages = await response.json();
  return { pages };
}

export default function MarketingLayout() {
  const { pages } = useLoaderData<typeof loader>();
  return (
    <>
      <div className="relative flex flex-col">
        <header className="bg-white">
          <nav className="mx-auto flex max-w-4xl items-center justify-between p-6 lg:px-0">
            <div className="flex lg:flex-1">
              <Link to="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  src={logoLight}
                  alt="HeadlessWP React Router Example"
                  className="block w-full max-w-[100px]"
                />
              </Link>
            </div>

            <div className="flex lg:gap-x-12">
              {pages.map((page: WPPage) => (
                <Link
                  key={page.id}
                  to={page.slug}
                  className="text-sm/6 font-semibold text-gray-900"
                >
                  {page.title.rendered}
                </Link>
              ))}
            </div>

            <div className=" flex flex-1 justify-end">
              <Link
                to="/dashboard"
                className="text-sm/6 font-semibold text-gray-900"
              >
                Dashboard <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </nav>
        </header>
        <Outlet />
        {/* <Footer /> */}
      </div>
    </>
  );
}
