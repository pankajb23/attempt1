import type { UserGuidePreferences } from '../../types';

export interface UseGuidePreferencesDAO {
    // this is an assumption for the time being.
    find(userId: string): Promise<UserGuidePreferences>
    update(data: UserGuidePreferences): Promise<void>
    updateShowAssistanceOnMainPageEnabled(isShowAssistanceOnMainPageEnabled: boolean): Promise<void>
    updateShowWarningOnOfferPageEnabled(isShowWarningOnOfferPageEnabled: boolean): Promise<void>
}

export class UserGuidePreferencesService {
    private dao: UseGuidePreferencesDAO

    constructor(useMock: boolean = false) {
        this.dao = 
            new MockUserGuidePreferencesDAO() 
        // new APIUserAccesiblityDAO('http://api.example.com');
    }

    find(userId: string): Promise<UserGuidePreferences> {
        return this.dao.find(userId);
    }

    update(data: UserGuidePreferences): Promise<void> {
        return this.dao.update(data);
    }

    updateShowAssistanceOnMainPageEnabled(isShowAssistanceOnMainPageEnabled: boolean): Promise<void> {
        return this.dao.updateShowAssistanceOnMainPageEnabled(isShowAssistanceOnMainPageEnabled);
    }

    updateShowWarningOnOfferPageEnabled(isShowWarningOnOfferPageEnabled: boolean): Promise<void> {
        return this.dao.updateShowWarningOnOfferPageEnabled(isShowWarningOnOfferPageEnabled);
    }
}

export class MockUserGuidePreferencesDAO implements UseGuidePreferencesDAO {
    private mockData: UserGuidePreferences = {
        userId: "alpha-gamma-beta",
        isShowAssistanceOnMainPageEnabled: true,
        isShowWarningOnOfferPageEnabled: true
    };

    find(userId: string): Promise<UserGuidePreferences> {
        return Promise.resolve(this.mockData);
    }

    update(data: UserGuidePreferences): Promise<void> {
        this.mockData = data;
        return Promise.resolve();
    }

    updateShowAssistanceOnMainPageEnabled(isShowAssistanceOnMainPageEnabled: boolean): Promise<void> {
        this.mockData.isShowAssistanceOnMainPageEnabled = isShowAssistanceOnMainPageEnabled;
        return Promise.resolve();
    }

    updateShowWarningOnOfferPageEnabled(isShowWarningOnOfferPageEnabled: boolean): Promise<void> {
        this.mockData.isShowWarningOnOfferPageEnabled = isShowWarningOnOfferPageEnabled;
        return Promise.resolve();
    }
}
