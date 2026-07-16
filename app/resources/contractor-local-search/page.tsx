import { resourceArticles } from "../article-data";
import {
  createResourceArticleMetadata,
  ResourceArticlePage,
} from "../article-template";

const article = resourceArticles["contractor-local-search"];

export const metadata = createResourceArticleMetadata(article);

export default function ContractorLocalSearchPage() {
  return <ResourceArticlePage article={article} />;
}
