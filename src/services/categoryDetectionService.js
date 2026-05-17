import {
  extractMerchantKey,
  findLearnedSuggestion,
  findRuleSuggestion
} from '../utils/categoryDetection/index.js';
import {
  getStoredCategoryLearning,
  saveStoredCategoryLearning
} from '../utils/storage/index.js';

export function detectCategory(note, type) {
  const learnedRules = getStoredCategoryLearning();
  return findLearnedSuggestion(note, type, learnedRules) ?? findRuleSuggestion(note, type);
}

export function learnCategoryForNote(note, category) {
  const merchantKey = extractMerchantKey(note);

  if (!merchantKey || !category) {
    return false;
  }

  const learnedRules = getStoredCategoryLearning();
  return saveStoredCategoryLearning({
    ...learnedRules,
    [merchantKey]: category
  });
}

export function shouldAutoSelectSuggestion(suggestion) {
  return suggestion?.confidence === 'high';
}
