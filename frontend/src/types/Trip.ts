export interface TripConcept {
  id: string;
  name: string;
  vibeDescription: string;
  estimatedTotalCost: number;
  budgetFit: 'within' | 'below' | 'exceeds';
  highlights: string[];
  bestFor: string;
}

export interface ItineraryOption {
  title: string;
  location: string;
  cost: number;
  tag: 'Popular' | 'Hidden Gem' | 'Budget-Friendly' | 'Highly Rated';
  reason: string;
}

export interface SlotOptions {
  options: ItineraryOption[];
}

export interface TransportLeg {
  from: string;
  to: string;
  mode: string;
  cost: number;
}

export interface PrimaryDayPlan {
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

export interface AlternativeDayPlan {
  label: string;
  dailyCost: number;
  summary: string;
}

export interface DayItinerary {
  day: number;
  dayPlans: [PrimaryDayPlan, AlternativeDayPlan, AlternativeDayPlan];
}

export interface RawItinerary {
  days: DayItinerary[];
  totalEstimate: number;
  budgetFlag: {
    isRealistic: boolean;
    note: string;
  };
  bestTimeToVisit: string;
  thingsToAvoid: string[];
}

export interface Trip {
  id: string;
  userId: string;
  city: string;
  startingFrom?: string | null;
  numberOfDays: number;
  budgetPerDay: number;
  travelStyle: string;
  interests: string[];
  travelerType: string;
  conceptName?: string | null;
  conceptVibe?: string | null;
  rawItinerary?: RawItinerary | null;
  createdAt: string;
}
