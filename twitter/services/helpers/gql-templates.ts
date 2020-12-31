import { gql } from 'apollo-boost';

export const GqlTemplates = {
  FIND_BLACKLISTED_WORDS: gql`
    query find_stop_words($hashtags: [String!]!) {
      insights_engagement_stop_words(where: { stop_word: { _in: $hashtags } }) {
        stop_word
      }
    }
  `
};
