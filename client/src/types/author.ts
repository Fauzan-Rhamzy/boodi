export type Author = {
    id: number; 
    name: string; 
    description: string;
    profile_pic: string;
    books: { id: number; title: string, cover: Text }[];
}