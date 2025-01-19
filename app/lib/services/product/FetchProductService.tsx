export interface Product {
  pid: string;
  img: string;
  label: string;
  isArchived: boolean;
}

export interface ProductTags {
  pid: string;
  img: string;
  label: string;
  priceVariation: string;
  variant: string;
  currency: string;
}

export interface ValueTags {
  id: string;
  tagId: string;
  label: string;
}

export interface FetchProductDAO {
  findPids(userId: string, label?: string): Promise<Product[]>;
}

export interface FetchProductTagsDAO {
  findTags(userId: string, label?: string): Promise<ProductTags[]>;
}

export interface FetchTagsDao {
  findAllTags(userId: string, label?: string): Promise<ValueTags[]>;
}

export class MockFetchProductDAO
  implements FetchProductDAO, FetchProductTagsDAO, FetchTagsDao
{
  private mockData = [
    {
      pid: '0',
      label: 'Product One',
      img: 'https://cdn.shopify.com/s/files/1/0802/4820/9601/files/gift_card_200x200.png?v=1728612434', // Using placeholder image
      isArchived: false,
    },
    {
      pid: '1',
      label: 'Product Two',
      img: 'https://cdn.shopify.com/s/files/1/0802/4820/9601/files/snowboard_wax_200x200.png?v=1728612437',
      isArchived: false,
    },
    {
      pid: '2',
      label: 'Product Three',
      img: 'https://cdn.shopify.com/s/files/1/0802/4820/9601/f…9-4d41-83f0-7f417b02831d_200x200.jpg?v=1728612435',
      isArchived: true,
    },
    {
      pid: '3',
      label: 'Product Four',
      img: 'https://cdn.shopify.com/s/files/1/0802/4820/9601/f…9-4a36-82af-50df8fe31c69_200x200.jpg?v=1728612434',
      isArchived: false,
    },
    {
      pid: '4',
      label: 'Product Five',
      img: 'https://cdn.shopify.com/s/files/1/0802/4820/9601/f…9-4fe1-b333-0d1548b43c06_200x200.jpg?v=1728612436',
      isArchived: true,
    },
  ];

  private tagsMockedData = [
    {
      id: '1',
      pid: 'P001',
      img: 'https://cdn.shopify.com/s/files/1/0802/4820/9601/files/gift_card_200x200.png?v=1728612434',
      label: 'Summer T-Shirt',
      variant: 'S',
      priceVariation: '19.99',
      currency: 'USD',
    },
    {
      id: '2',
      pid: 'P001',
      img: 'https://cdn.shopify.com/s/files/1/0802/4820/9601/files/gift_card_200x200.png?v=1728612434',
      label: 'Summer T-Shirt',
      priceVariation: '15.99',
      variant: 'SM',
      currency: 'EUR',
    },
    {
      id: '3',
      pid: 'P001',
      img: 'https://cdn.shopify.com/s/files/1/0802/4820/9601/files/gift_card_200x200.png?v=1728612434',
      label: 'Summer T-Shirt',
      priceVariation: '1500',
      variant: 'XL',
      currency: 'JPY',
    },
    {
      id: '4',
      pid: 'P002',
      img: 'https://cdn.shopify.com/s/files/1/0802/4820/9601/files/snowboard_wax_200x200.png?v=1728612437',
      label: 'Denim Jeans',
      variant: 'L',
      priceVariation: '49.99',
      currency: 'USD',
    },
    {
      id: '5',
      pid: 'P002',
      img: 'https://cdn.shopify.com/s/files/1/0802/4820/9601/files/snowboard_wax_200x200.png?v=1728612437',
      label: 'Denim Jeans',
      priceVariation: '45.99',
      variant: 'S',
      currency: 'EUR',
    },
    {
      id: '6',
      pid: 'P002',
      img: 'https://cdn.shopify.com/s/files/1/0802/4820/9601/files/snowboard_wax_200x200.png?v=1728612437',
      label: 'Denim Jeans',
      priceVariation: '4500',
      variant: 'S',
      currency: 'JPY',
    },
    {
      id: '7',
      pid: 'P003',
      img: 'https://cdn.shopify.com/s/files/1/0802/4820/9601/f…9-4d41-83f0-7f417b02831d_200x200.jpg?v=1728612435',
      label: 'Sports Sneakers',
      variant: 'SS',
      priceVariation: '79.99',
      currency: 'USD',
    },
    {
      id: '8',
      pid: 'P003',
      img: 'https://cdn.shopify.com/s/files/1/0802/4820/9601/f…9-4d41-83f0-7f417b02831d_200x200.jpg?v=1728612435',
      label: 'Sports Sneakers',
      variant: 'SL',
      priceVariation: '75.99',
      currency: 'EUR',
    },
    {
      id: '9',
      pid: 'P003',
      img: 'https://cdn.shopify.com/s/files/1/0802/4820/9601/f…9-4d41-83f0-7f417b02831d_200x200.jpg?v=1728612435',
      label: 'Sports Sneakers',
      variant: 'SL',
      priceVariation: '7500',
      currency: 'JPY',
    },
    {
      id: '10',
      pid: 'P004',
      img: 'https://cdn.shopify.com/s/files/1/0802/4820/9601/f…9-4a36-82af-50df8fe31c69_200x200.jpg?v=1728612434',
      label: 'Travel Backpack',
      variant: 'SM',
      priceVariation: '29.99',
      currency: 'USD',
    },
    {
      id: '11',
      pid: 'P004',
      img: 'https://cdn.shopify.com/s/files/1/0802/4820/9601/f…9-4a36-82af-50df8fe31c69_200x200.jpg?v=1728612434',
      label: 'Travel Backpack',
      variant: 'SX',
      priceVariation: '25.99',
      currency: 'EUR',
    },
    {
      id: '12',
      pid: 'P004',
      img: 'https://cdn.shopify.com/s/files/1/0802/4820/9601/f…9-4a36-82af-50df8fe31c69_200x200.jpg?v=1728612434',
      label: 'Travel Backpack',
      variant: 'SK',
      priceVariation: '2500',
      currency: 'JPY',
    },
    {
      id: '13',
      pid: 'P005',
      img: 'https://cdn.shopify.com/s/files/1/0802/4820/9601/f…9-4fe1-b333-0d1548b43c06_200x200.jpg?v=1728612436',
      label: 'Smart Watch',
      variant: 'SL',
      priceVariation: '199.99',
      currency: 'USD',
    },
    {
      id: '14',
      pid: 'P005',
      img: 'https://cdn.shopify.com/s/files/1/0802/4820/9601/f…9-4fe1-b333-0d1548b43c06_200x200.jpg?v=1728612436',
      label: 'Smart Watch',
      variant: 'SL',
      priceVariation: '185.99',
      currency: 'EUR',
    },
    {
      id: '15',
      pid: 'P005',
      img: 'https://cdn.shopify.com/s/files/1/0802/4820/9601/f…9-4fe1-b333-0d1548b43c06_200x200.jpg?v=1728612436',
      label: 'Smart Watch',
      variant: 'SL',
      priceVariation: '18500',
      currency: 'JPY',
    },
  ];

  private tagsMockedD = [
    { id: '0', tagId: 'status-001', label: 'Archived' },
    { id: '1', tagId: 'status-003', label: 'Premium' },
    { id: '2', tagId: 'status-023', label: 'Snow' },
    { id: '3', tagId: 'status-033', label: 'Snowboard' },
    { id: '4', tagId: 'status-043', label: 'Sport' },
    { id: '5', tagId: 'status-053', label: 'Winter' },
  ];

  findPids(userId: string, label?: string): Promise<Product[]> {
    return Promise.resolve(this.mockData);
  }

  findTags(userId: string, label?: string): Promise<ProductTags[]> {
    return Promise.resolve(this.tagsMockedData);
  }

  findAllTags(userId: string, label?: string): Promise<ValueTags[]> {
    return Promise.resolve(this.tagsMockedD);
  }
}

export class FetchProductService {
  private dao: FetchProductDAO;
  private productTagsDAO: FetchProductTagsDAO;
  private tagsDAO: FetchTagsDao;

  constructor(userMock: boolean = true) {
    this.dao = new MockFetchProductDAO();
    this.productTagsDAO = new MockFetchProductDAO();
    this.tagsDAO = new MockFetchProductDAO();
  }

  findPids(userId: string, label?: string): Promise<Product[]> {
    return this.dao.findPids(userId, label);
  }

  findTags(userId: string, label?: string): Promise<ProductTags[]> {
    return this.productTagsDAO.findTags(userId, label);
  }

  findAllTags(userId: string, label?: string): Promise<ValueTags[]> {
    return this.tagsDAO.findAllTags(userId, label);
  }
}
