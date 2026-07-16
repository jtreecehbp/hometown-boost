import { resourceArticles } from "../article-data";
import {
  createResourceArticleMetadata,
  ResourceArticlePage,
} from "../article-template";

const article = resourceArticles["rank-higher-google-maps"];

export const metadata = createResourceArticleMetadata(article);

export default function RankHigherGoogleMapsPage() {
  return <ResourceArticlePage article={article} />;
}
