import { resourceArticles } from "../article-data";
import {
  createResourceArticleMetadata,
  ResourceArticlePage,
} from "../article-template";

const article = resourceArticles["equipment-dealer-website"];

export const metadata = createResourceArticleMetadata(article);

export default function EquipmentDealerWebsitePage() {
  return <ResourceArticlePage article={article} />;
}
