import { ContentDetailClient } from "@/components/content-detail-client";
export default function TemplateDetailPage({ params }: { params: { slug: string } }) { return <main className="container-page py-12"><ContentDetailClient slug={params.slug} /></main>; }
