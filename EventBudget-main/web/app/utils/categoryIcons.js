export const colorOptions = [
  "#FFE5B4",
  "#FFD7D2",
  "#FFCACA",
  "#FFECB3",
  "#FFF5CC",
  "#D4F6C8",
  "#C8E5FF",
  "#D8D1FF",
  "#F3C9FF",
  "#E2E2E2",
];

export const iconCategoryList = [
  { key: "money", label: "Money" },
  { key: "food", label: "Food" },
  { key: "animals", label: "Animals" },
  { key: "gifts", label: "Gifts" },
  { key: "travel", label: "Travel" },
  { key: "drinks", label: "Drinks" },
];

export const iconCategories = {
  money: ["twemoji:money-bag", "twemoji:coin", "twemoji:chart-increasing", "twemoji:credit-card", "twemoji:shopping-bags"],
  food: ["twemoji:hamburger", "twemoji:pizza", "twemoji:green-salad", "twemoji:french-fries", "twemoji:strawberry"],
  animals: ["twemoji:cat", "twemoji:dog", "twemoji:rabbit", "twemoji:bear", "twemoji:elephant"],
  gifts: ["twemoji:wrapped-gift", "twemoji:party-popper", "twemoji:balloon", "twemoji:ribbon", "twemoji:sparkles"],
  travel: ["twemoji:airplane", "twemoji:automobile", "twemoji:ship", "twemoji:train", "twemoji:rocket"],
  drinks: ["twemoji:hot-beverage", "twemoji:teacup-without-handle", "twemoji:glass-of-milk", "twemoji:clinking-beer-mugs", "twemoji:bubble-tea"],
};

export const findCategoryByIcon = (icon) =>
  Object.keys(iconCategories).find((k) =>
    iconCategories[k].includes(icon)
  );
