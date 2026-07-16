export interface TripFormData {
  city: string;
  numberOfDays: number;
  budgetPerDay: number;
  travelStyle: "Budget" | "Mid-range" | "Luxury";
  interests: string[];
  travelerType: "Solo" | "Couple" | "Family" | "Friends";
  startingFrom?: string;
}
