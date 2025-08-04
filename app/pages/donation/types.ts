export type Status = "active" | "closed" | "archived";

// Represents a single donation record for display in the donation list table
export interface ShowDonationItem {
  id: string;
  title: string;
  location: string;
  target_amount: number;
  collected_amount: number;
  status: Status;
  ends_at: string;
  slug: string;
}
