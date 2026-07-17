import { createPageMetadata } from "../../page-metadata";
import { industryDetails } from "../../industry-detail-data";
import { IndustryDetailPage } from "../../industry-detail-page";

const industry = industryDetails["retail-businesses"];

export const metadata = createPageMetadata({
  title: industry.metaTitle,
  description: industry.metaDescription,
  path: industry.path,
});

export default function RetailBusinessesPage() {
  return <IndustryDetailPage industry={industry} />;
}
