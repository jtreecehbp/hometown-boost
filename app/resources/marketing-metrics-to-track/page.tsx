import { resourceArticles } from "../article-data";
import {
  createResourceArticleMetadata,
  ResourceArticlePage,
} from "../article-template";

const article = resourceArticles["marketing-metrics-to-track"];

export const metadata = createResourceArticleMetadata(article);

export default function MarketingMetricsToTrackPage() {
  return <ResourceArticlePage article={article} />;
}
