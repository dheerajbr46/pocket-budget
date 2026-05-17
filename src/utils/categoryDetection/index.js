import { expenseCategories, incomeCategories } from '../../constants/categories.js';
import { categoryRules, confidenceRank } from '../../constants/categoryRules.js';

export function normalizeMerchantText(value = '') {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function extractMerchantKey(value = '') {
  const normalizedText = normalizeMerchantText(value);
  const [firstToken = ''] = normalizedText.split(' ');
  return firstToken;
}

function categoryMatchesType(category, type) {
  return type === 'income' ? incomeCategories.includes(category) : expenseCategories.includes(category);
}

function createSuggestion({ category, confidence, keyword, source }) {
  return {
    category,
    confidence,
    keyword,
    source
  };
}

export function findRuleSuggestion(note, type) {
  const normalizedNote = normalizeMerchantText(note);

  if (!normalizedNote) {
    return null;
  }

  const suggestions = categoryRules
    .filter((rule) => categoryMatchesType(rule.category, type))
    .flatMap((rule) =>
      rule.keywords
        .filter((keyword) => normalizedNote.includes(keyword))
        .map((keyword) =>
          createSuggestion({
            category: rule.category,
            confidence: rule.confidence,
            keyword,
            source: 'rule'
          })
        )
    );

  return suggestions.sort((first, second) => confidenceRank[second.confidence] - confidenceRank[first.confidence])[0] ?? null;
}

export function findLearnedSuggestion(note, type, learnedRules = {}) {
  const merchantKey = extractMerchantKey(note);
  const category = learnedRules[merchantKey];

  if (!merchantKey || !category || !categoryMatchesType(category, type)) {
    return null;
  }

  return createSuggestion({
    category,
    confidence: 'high',
    keyword: merchantKey,
    source: 'learned'
  });
}
