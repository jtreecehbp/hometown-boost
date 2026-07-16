import { createPageMetadata } from "../../page-metadata";
import { serviceDetails } from "../../service-detail-data";
import { ServiceDetailPage } from "../../service-detail-template";

const service = serviceDetails.paidAdvertising;

export const metadata = createPageMetadata({
  title: service.metadataTitle,
  description: service.metadataDescription,
  path: "/services/paid-advertising",
});

export default function PaidAdvertisingPage() {
  return <ServiceDetailPage service={service} />;
}
