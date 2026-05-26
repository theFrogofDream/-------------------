export const CATEGORIES = [
  { id: 1, name: "Металлопрокат" },
  { id: 2, name: "Литье чугунное" },
  { id: 3, name: "Асбестоцементные материалы" },
  { id: 4, name: "Строительные материалы" },
  { id: 5, name: "Метизы" },
  { id: 6, name: "ЖБИ изделия" },
  { id: 7, name: "Полимерные материалы" },
  { id: 8, name: "Полиэтиленовые материалы" },
  { id: 9, name: "Резинотехнические изделия" },
  { id: 10, name: "Сантехнические комплектующие" },
  { id: 11, name: "Сварочное оборудование" },
  { id: 12, name: "Материалы для наружной отделки" },
  { id: 13, name: "Материалы для внутренней отделки" },
  { id: 14, name: "Металлоизделия" },
];

const IMG =
  "https://images.unsplash.com/photo-1628748714348-79dc6e6400c0?w=400&h=300&fit=crop";

export const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Кирпич облицовочный",
    description: "Описание Описание Описание Описание",
    price: 5667,
    count: 120,
    image_url: IMG,
    tag_id: 4,
  },
  {
    id: 2,
    name: "Керамогранит",
    description: "Описание Описание Описание Описание",
    price: 3456,
    count: 50,
    image_url: IMG,
    tag_id: 12,
  },
  {
    id: 3,
    name: "Бетоназол",
    description: "Описание Описание Описание Описание",
    price: 4200,
    count: 30,
    image_url: IMG,
    tag_id: 4,
  },
  {
    id: 4,
    name: "Керамогранит",
    description: "Описание Описание Описание Описание",
    price: 3456,
    count: 15,
    image_url: IMG,
    tag_id: 13,
  },
  {
    id: 5,
    name: "Кирпич облицовочный",
    description: "Описание Описание Описание Описание",
    price: 5667,
    count: 80,
    image_url: IMG,
    tag_id: 4,
  },
  {
    id: 6,
    name: "Бетоназол",
    description: "Описание Описание Описание Описание",
    price: 4200,
    count: 0,
    image_url: IMG,
    tag_id: 6,
  },
];

export const ORDER_STATUSES = ["Новый", "В обработке", "Доставляется", "Выполнен", "Отменён"];

export const MOCK_ORDERS = [
  {
    id: 1,
    adress: "ул. Ленина, 10",
    date: "2026-06-01",
    full_price: 3456,
    status: "Новый",
    status_id: 1,
    products: [
      {
        id: 2,
        name: "Керамогранит",
        price: 3456,
        qty: 1,
        image_url: IMG,
      },
    ],
  },
];
