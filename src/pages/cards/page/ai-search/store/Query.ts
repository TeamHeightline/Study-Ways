import recombee from 'recombee-js-api-client';
import recombeeClient from '../../../../../shared/store/recombee-client/recombee-client';

import { studyWaysApi } from '../../../../../shared/server-layer/query-layer/api';
interface Recommendation {
  recommId: string;
  recomms: { id: string; values?: { title?: string } }[];
}
interface Search {
  search: string;
  filter: string;
  count: number;
  userId: string;
}
export const aiSearchApi = studyWaysApi.injectEndpoints({
  endpoints: build => ({
    getAIRecommendations: build.query<Recommendation, Search>({
      queryFn: async ({ search, filter, count, userId }) => {
        try {
          const data = await new Promise<Recommendation>((resolve, reject) => {
            const options = {
              returnProperties: true,
              cascadeCreate: true,
              includedProperties: ['title'],
              filter: filter || undefined,
            };
            const request = search
              ? new recombee.SearchItems(userId, search, count, {
                  ...options,
                  scenario: 'Search-Card',
                })
              : new recombee.RecommendItemsToUser(userId, count, options);
            recombeeClient.send(request, (error, matches) => {
              if (error) reject(error);
              else resolve(matches as Recommendation);
            });
          });
          return { data };
        } catch {
          return {
            error: { status: 500, data: 'Не удалось получить рекомендации' },
          };
        }
      },
    }),
  }),
});
export const { useGetAIRecommendationsQuery } = aiSearchApi;
export async function selectRecommendedCardReport(
  recommendationID: string,
  itemId: string,
  userId: string,
) {
  if (recommendationID && itemId) {
    await recombeeClient.send(
      new recombee.AddDetailView(userId, String(itemId), {
        recommId: recommendationID,
      }),
    );
  }
}
