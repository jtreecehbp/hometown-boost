import { createPageMetadata } from "../../page-metadata";
import { serviceDetails } from "../../service-detail-data";
import { ServiceDetailPage } from "../../service-detail-template";

const service = serviceDetails.reputationManagement;

export const metadata = createPageMetadata({
  title: service.metadataTitle,
  description: service.metadataDescription,
  path: "/services/reputation-management",
});

export default function ReputationManagementPage() {
  return <ServiceDetailPage service={service} />;
}
