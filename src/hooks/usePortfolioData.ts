import { useTranslation } from 'react-i18next';
import id from '../content/portfolio.id.json';
import en from '../content/portfolio.en.json';
import zh from '../content/portfolio.zh.json';
import pt from '../content/portfolio.pt.json';
import ar from '../content/portfolio.ar.json';

const dataMap: Record<string, any> = {
  id,
  en,
  zh,
  pt,
  ar,
};

export function usePortfolioData() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const baseData = dataMap['id'];
  const currentData = dataMap[lang] || baseData;

  // If language is ID, no fallback needed
  if (lang === 'id' || !dataMap[lang]) return baseData;

  // Create a deep copy to avoid mutating the static JSON imports
  const merged = JSON.parse(JSON.stringify(currentData));

  // Fallback for Hero Images (Lanyard, CV Link)
  if (merged.hero && baseData.hero) {
    merged.hero.cvLink = merged.hero.cvLink || baseData.hero.cvLink;
    if (merged.hero.lanyard && baseData.hero.lanyard) {
      merged.hero.lanyard.avatar = merged.hero.lanyard.avatar || baseData.hero.lanyard.avatar;
    }
  }

  // Fallback for Array lists (Organizations, Education, Companies, Projects, Certificates)
  const lists = ['organizations', 'education', 'companies', 'projects', 'certificates'];
  lists.forEach((listName) => {
    if (merged[listName] && baseData[listName]) {
      merged[listName] = merged[listName].map((item: any, i: number) => {
        const baseItem = baseData[listName][i] || {};
        // Common image/file fields
        item.logo = item.logo || baseItem.logo;
        item.image = item.image || baseItem.image;
        item.file = item.file || baseItem.file;
        return item;
      });
    }
  });

  return merged;
}
