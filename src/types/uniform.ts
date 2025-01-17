export interface UniformSize {
  id: string;
  category_id: string;
  item_id: string;
  size_id: string;
  size_label: string;
}

export interface UniformItem {
  id: string;
  name: string;
}

export interface UniformCategory {
  id: string;
  name: string;
  items: UniformItem[];
}

export interface UniformFormData {
  firstName: string;
  lastName: string;
  selectedCategory: string;
  selectedSizes: Record<string, string>;
}