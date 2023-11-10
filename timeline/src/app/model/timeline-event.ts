export interface TimelineEvent {
    event_id: number;
    event_name: string;
    start_date: Date | null;
    end_date: Date | null;
    description: string;
    image_url: string; 
    category_id: number;
}