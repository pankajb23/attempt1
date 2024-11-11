
export interface Product {
    pid: string
    img: string
    label: string
    isArchived: boolean
}

export interface Tags {
    priceVariation: string
    currency: string
}

export interface ProductTags {
    pid: string
    img: string
    label: string
    tags: Tags[]
}

export interface ValueTags {
    tagId: string
    label: string
}

export interface FetchProductDAO {
    findPids(userId: string, label?: string): Promise<Product[]>
}

export interface FetchProductTagsDAO {
    findTags(userId: string, label?: string): Promise<ProductTags[]>
}

export interface FetchTagsDao {
    findAllTags(userId: string, label?: string): Promise<ValueTags[]>
}

export class MockFetchProductDAO implements FetchProductDAO, FetchProductTagsDAO, FetchTagsDao {
    private mockData = [
        {
            pid: "1",
            label: "Product One",
            img: "https://cdn.shopify.com/s/files/1/0802/4820/9601/files/gift_card_200x200.png?v=1728612434",  // Using placeholder image
            isArchived: false
        },
        {
            pid: "2",
            label: "Product Two",
            img: "https://cdn.shopify.com/s/files/1/0802/4820/9601/files/snowboard_wax_200x200.png?v=1728612437",
            isArchived: false
        },
        {
            pid: "3",
            label: "Product Three",
            img: "https://cdn.shopify.com/s/files/1/0802/4820/9601/f…9-4d41-83f0-7f417b02831d_200x200.jpg?v=1728612435",
            isArchived: true
        },
        {
            pid: "4",
            label: "Product Four",
            img: "https://cdn.shopify.com/s/files/1/0802/4820/9601/f…9-4a36-82af-50df8fe31c69_200x200.jpg?v=1728612434",
            isArchived: false
        },
        {
            pid: "5",
            label: "Product Five",
            img: "https://cdn.shopify.com/s/files/1/0802/4820/9601/f…9-4fe1-b333-0d1548b43c06_200x200.jpg?v=1728612436",
            isArchived: true
        }
    ];

    private tagsMockedData = [
        {
            pid: "P001",
            img: "https://example.com/tshirt-blue.jpg",
            label: "Summer T-Shirt",
            tags: [
                { priceVariation: "19.99", currency: "USD" },
                { priceVariation: "15.99", currency: "EUR" },
                { priceVariation: "1500", currency: "JPY" }
            ]
        },
        {
            pid: "P002",
            img: "https://example.com/jeans-black.jpg",
            label: "Denim Jeans",
            tags: [
                { priceVariation: "49.99", currency: "USD" },
                { priceVariation: "45.99", currency: "EUR" },
                { priceVariation: "4500", currency: "JPY" }
            ]
        },
        {
            pid: "P003",
            img: "https://example.com/sneakers-white.jpg",
            label: "Sports Sneakers",
            tags: [
                { priceVariation: "79.99", currency: "USD" },
                { priceVariation: "75.99", currency: "EUR" },
                { priceVariation: "7500", currency: "JPY" }
            ]
        },
        {
            pid: "P004",
            img: "https://example.com/backpack-green.jpg",
            label: "Travel Backpack",
            tags: [
                { priceVariation: "29.99", currency: "USD" },
                { priceVariation: "25.99", currency: "EUR" },
                { priceVariation: "2500", currency: "JPY" }
            ]
        },
        {
            pid: "P005",
            img: "https://example.com/watch-silver.jpg",
            label: "Smart Watch",
            tags: [
                { priceVariation: "199.99", currency: "USD" },
                { priceVariation: "185.99", currency: "EUR" },
                { priceVariation: "18500", currency: "JPY" }
            ]
        }
    ];

    private tagsMockedD = [{ tagId: "status-001", label: "Archived" },
    { tagId: "status-003", label: "Premium" },
    { tagId: "status-023", label: "Snow" },
    { tagId: "status-033", label: "Snowboard" },
    { tagId: "status-043", label: "Sport" },
    { tagId: "status-053", label: "Winter" }
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

    constructor(userMock: boolean= true) {
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