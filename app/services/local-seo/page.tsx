import { createPageMetadata } from "../../page-metadata";
import { serviceDetails } from "../../service-detail-data";
import { ServiceDetailPage } from "../../service-detail-template";

const service = serviceDetails.localSeo;

export const metadata = createPageMetadata({
  title: service.metadataTitle,
  description: service.metadataDescription,
  path: "/services/local-seo",
});

export default function LocalSeoPage() {
  return <ServiceDetailPage service={service} />;
}
