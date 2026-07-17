import { createPageMetadata } from "../../page-metadata";
import { industryDetails } from "../../industry-detail-data";
import { IndustryDetailPage } from "../../industry-detail-page";

const industry = industryDetails.contractors;

export const metadata = createPageMetadata({
  title: industry.metaTitle,
  description: industry.metaDescription,
  path: industry.path,
});

export default function ContractorsPage() {
  return <IndustryDetailPage industry={industry} />;
}
