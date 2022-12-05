export interface Quote {
    _id:         string;
    quote_text:  string;
    author_name: string;
    createdAt:   Date;
    updatedAt:   Date;
    __v:         number;
    gender?: string;
}

export interface Column {
    id: 'id' | 'author_name' | 'quote_text' | 'gender';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
  }