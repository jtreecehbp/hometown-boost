import { createPageMetadata } from "../../page-metadata";
import { serviceDetails } from "../../service-detail-data";
import { ServiceDetailPage } from "../../service-detail-template";

const service = serviceDetails.callTracking;

export const metadata = createPageMetadata({
  title: service.metadataTitle,
  description: service.metadataDescription,
  path: "/services/call-tracking",
});

export default function CallTrackingPage() {
  return <ServiceDetailPage service={service} />;
}
