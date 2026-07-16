import { resourceArticles } from "../article-data";
import {
  createResourceArticleMetadata,
  ResourceArticlePage,
} from "../article-template";

const article = resourceArticles["website-not-generating-calls"];

export const metadata = createResourceArticleMetadata(article);

export default function WebsiteNotGeneratingCallsPage() {
  return <ResourceArticlePage article={article} />;
}
