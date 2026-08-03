import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

const APP_URL = "/siteflow/index.html";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SiteFlow · Operations Platform — Housing" },
      {
        name: "description",
        content:
          "SiteFlow Housing: planificare cazări, ocupare în timp real, costuri, alerte și rapoarte pentru echipele de șantier.",
      },
      { property: "og:title", content: "SiteFlow · Operations Platform — Housing" },
      {
        property: "og:description",
        content:
          "Planner de cazare, dashboard de ocupare, costuri și rapoarte — modulul Housing al platformei SiteFlow.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    window.location.replace(APP_URL);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          SiteFlow
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Se deschide modulul Housing…
        </p>
        <a
          href={APP_URL}
          className="mt-5 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Deschide SiteFlow
        </a>
      </div>
    </div>
  );
}
