import { resourceArticles } from "../article-data";
import {
  createResourceArticleMetadata,
  ResourceArticlePage,
} from "../article-template";

const article = resourceArticles["get-more-google-reviews"];

export const metadata = createResourceArticleMetadata(article);

export default function GetMoreGoogleReviewsPage() {
  return <ResourceArticlePage article={article} />;
}
