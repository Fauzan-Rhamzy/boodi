export type Author = {
    id: number; 
    name: string; 
    description: string;
    profilePic: string;
    books: { id: number; title: string, cover: Text }[];
}