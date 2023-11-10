export interface TimelineEvent {
    event_id: number;
    event_name: string;
    start_date: Date;
    end_date: Date;
    description: string;
    image_url: string; 
    category_id: number;
}