
export interface User {
  _id?:      string;
  id?:      string;
  email:    string;
  name:     string;
  isActive: boolean;
  roles:    string[];
}
