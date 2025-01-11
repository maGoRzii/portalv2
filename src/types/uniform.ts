export interface UniformSize {
  id: string;
  label: string;
}

export interface UniformItem {
  id: string;
  name: string;
  sizes: UniformSize[];
}

export interface UniformCategory {
  id: string;
  name: string;
  items: UniformItem[];
}

export interface UniformRequest {
  id?: string;
  first_name: string;
  last_name: string;
  items: {
    item_id: string;
    size: string;
  }[];
  created_at?: string;
}