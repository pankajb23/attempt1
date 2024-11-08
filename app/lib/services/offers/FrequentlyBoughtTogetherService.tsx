import { type FrequentlyBoughtTogetherType, getMockedData } from "app/routes/components/types/FrequentlyBoughtTogetherTypes"

export interface FrequentlyBoughtTogetherDAO {
    // we will not allow duplicates here.
    find(offerName: string, userId: string): Promise<FrequentlyBoughtTogetherType>
    delete(offerName: string, label: string, userId: string): Promise<void>
    upsert(label: string, userId: string, type: FrequentlyBoughtTogetherType, offerId?: string): Promise<FrequentlyBoughtTogetherType>
}

export class MockedFrequentlyBoughtTogetherDAO implements FrequentlyBoughtTogetherDAO {
    private mockedData: FrequentlyBoughtTogetherType = getMockedData();

    upsert(label: string, userId: string, type: FrequentlyBoughtTogetherType, offerId?: string): Promise<FrequentlyBoughtTogetherType> {
        this.mockedData = type
        return Promise.resolve(this.mockedData);
    }

    find(offerName: string, userId: string): Promise<FrequentlyBoughtTogetherType> {
        return Promise.resolve(this.mockedData);
    }

    delete(offerName: string, label: string, userId: string): Promise<void> {
        this.mockedData = null;
        return Promise.resolve();
    }
}

export class FrequentlyBoughtTogetherService {
    private dao: FrequentlyBoughtTogetherDAO;

    constructor(useMock: boolean = false) {
        this.dao = new MockedFrequentlyBoughtTogetherDAO();
    }

    find(offerName: string, userId: string): Promise<FrequentlyBoughtTogetherType> {
        return this.dao.find(offerName, userId);
    }

    delete(offerName: string, label: string, userId: string): Promise<void> {
        return this.dao.delete(offerName, label, userId);
    }

    upsert(label: string, userId: string, type: FrequentlyBoughtTogetherType, offerId?: string): Promise<FrequentlyBoughtTogetherType> {
        return this.dao.upsert(label, userId, type, offerId);
    }
}

