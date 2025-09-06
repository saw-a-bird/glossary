export interface Reference {
    id: string;
    title: string;
    content: string; 
    creation_date: Date;
    tags?: string;
    links?: string;
    modification_date?: Date;
}