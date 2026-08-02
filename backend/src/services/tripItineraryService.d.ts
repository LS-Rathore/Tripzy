interface TripItineraryDetails {
    city: string;
    startingFrom?: string;
    numberOfDays: number;
    budgetPerDay: number;
    travelStyle: string;
    interests: string[];
    travelerType: string;
    conceptName: string;
    conceptVibe: string;
}
interface ItineraryOption {
    title: string;
    location: string;
    cost: number;
    tag: 'Popular' | 'Hidden Gem' | 'Budget-Friendly' | 'Highly Rated';
    reason: string;
}
interface SlotOptions {
    options: ItineraryOption[];
}
interface TransportLeg {
    from: string;
    to: string;
    mode: string;
    cost: number;
}
interface PrimaryDayPlan {
    label: 'Primary';
    dailyCost: number;
    morning: SlotOptions;
    afternoon: SlotOptions;
    evening: SlotOptions;
    food: {
        breakfast: SlotOptions;
        lunch: SlotOptions;
        dinner: SlotOptions;
    };
    transport: TransportLeg[];
}
interface AlternativeDayPlan {
    label: string;
    dailyCost: number;
    summary: string;
}
interface DayItinerary {
    day: number;
    dayPlans: [PrimaryDayPlan, AlternativeDayPlan, AlternativeDayPlan];
}
interface ItineraryResponse {
    days: DayItinerary[];
    totalEstimate: number;
    budgetFlag: {
        isRealistic: boolean;
        note: string;
    };
    bestTimeToVisit: string;
    thingsToAvoid: string[];
}
export declare function generateTripItinerary(details: TripItineraryDetails): Promise<ItineraryResponse>;
export {};
//# sourceMappingURL=tripItineraryService.d.ts.map