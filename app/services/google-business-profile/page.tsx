import { createPageMetadata } from "../../page-metadata";
import { serviceDetails } from "../../service-detail-data";
import { ServiceDetailPage } from "../../service-detail-template";

const service = serviceDetails.googleBusinessProfile;

export const metadata = createPageMetadata({
  title: service.metadataTitle,
  description: service.metadataDescription,
  path: "/services/google-business-profile",
});

export default function GoogleBusinessProfilePage() {
  return <ServiceDetailPage service={service} />;
}
