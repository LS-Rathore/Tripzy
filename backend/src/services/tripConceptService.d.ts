interface TripDetails {
    city: string;
    startingFrom?: string;
    numberOfDays: number;
    budgetPerDay: number;
    travelStyle: string;
    interests: string[];
    travelerType: string;
}
interface TripConcept {
    id: string;
    name: string;
    vibeDescription: string;
    estimatedTotalCost: number;
    budgetFit: 'within' | 'below' | 'exceeds';
    highlights: string[];
    bestFor: string;
}
interface ConceptsResponse {
    concepts: TripConcept[];
}
export declare function generateTripConcepts(trip: TripDetails): Promise<ConceptsResponse>;
export {};
//# sourceMappingURL=tripConceptService.d.ts.map