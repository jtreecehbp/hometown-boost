import { resourceArticles } from "../article-data";
import {
  createResourceArticleMetadata,
  ResourceArticlePage,
} from "../article-template";

const article = resourceArticles["google-business-profile-mistakes"];

export const metadata = createResourceArticleMetadata(article);

export default function GoogleBusinessProfileMistakesPage() {
  return <ResourceArticlePage article={article} />;
}
