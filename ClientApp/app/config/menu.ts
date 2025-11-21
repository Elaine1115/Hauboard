export const menuZh = [
  {
    label: "關於我們",
    path: "/about-us",
  },
  {
    label: "最新消息",
    path: "/news",
  },
  {
    label: "供應商",
    path: "/vendor-introduction",
  },
  {
    label: "產品",
    path: "/products",
    children: [
      {
        label: "木紋",
        path: "/products?category=woodgrain",
      },
      {
        label: "布紋",
        path: "/products?category=fabric",
      },
      {
        label: "經典",
        path: "/products?category=classic",
      },
      {
        label: "大理石",
        path: "/products?category=marble",
      },
      {
        label: "素色",
        path: "/products?category=solid",
      },
    ],
  },
  {
    label: "品質",
    path: "/quality-standards",
  },
  {
    label: "常見問題",
    path: "/faq",
  },
];

export const menuEn = [
  {
    label: "About Us",
    path: "/about-us",
  },
  {
    label: "News",
    path: "/news",
  },
  {
    label: "Provider",
    path: "/vendor-introduction",
  },
  {
    label: "Product",
    path: "/products",
    children: [
      {
        label: "Wood Grain",
        path: "/products?category=woodgrain",
      },
      {
        label: "Fabric",
        path: "/products?category=fabric",
      },
      {
        label: "Classic",
        path: "/products?category=classic",
      },
      {
        label: "Marble",
        path: "/products?category=marble",
      },
      {
        label: "Solid",
        path: "/products?category=solid",
      },
    ],
  },
  {
    label: "Quality",
    path: "/quality-standards",
  },
  {
    label: "FAQ",
    path: "/faq",
  },
];

export const getMenuItems = (locale: string) => {
  return locale === "zh" ? menuZh : menuEn;
};
