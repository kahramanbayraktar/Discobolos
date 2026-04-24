import { Clock, ExternalLink, FileText, Presentation, Search } from "lucide-react";
import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return {
    title: dict.resources_page.meta.title,
    description: dict.resources_page.meta.description,
  };
}

export default async function ResourcesPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const rp = dict.resources_page;

  const RESOURCES = [
    {
      ...rp.items[0],
      type: "pdf", 
      link: "#"
    },
    {
      ...rp.items[1],
      type: "drive",
      link: "#"
    },
    {
      ...rp.items[2],
      type: "pdf",
      link: "#"
    }
  ];

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight md:text-5xl mb-4">
                {rp.header.title}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                {rp.header.description}
              </p>
            </div>
            
            {/* Search Bar (Visual Only for this mockup) */}
            <div className="relative w-full md:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder={rp.search_placeholder}
                className="block w-full pl-10 pr-3 py-2.5 border border-input rounded-xl leading-5 bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-all sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {RESOURCES.map((resource) => (
            <div 
              key={resource.id}
              className="group relative flex flex-col bg-card text-card-foreground border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="p-6 flex-grow">
                
                {/* Type Badge & Date */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase
                    ${resource.type === 'pdf' 
                      ? 'bg-destructive/10 text-destructive' 
                      : 'bg-primary/10 text-primary'}`}
                  >
                    {resource.type === 'pdf' ? (
                      <><FileText className="w-3.5 h-3.5 mr-1" /> {rp.types.pdf}</>
                    ) : (
                      <><Presentation className="w-3.5 h-3.5 mr-1" /> {rp.types.slides}</>
                    )}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {resource.date}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-primary transition-colors">
                  {resource.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-6">
                  {resource.description}
                </p>
              </div>

              {/* Footer / Meta & Action */}
              <div className="px-6 py-4 border-t bg-muted/50 flex items-center justify-between">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5 mr-1.5" />
                  {resource.readTime}
                </div>
                
                <a 
                  href={resource.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors relative z-10 cursor-pointer"
                >
                  {rp.view}
                  <ExternalLink className="ml-2 w-4 h-4" />
                </a>
              </div>

              {/* Subtle Gradient Overlay for visual flair */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
