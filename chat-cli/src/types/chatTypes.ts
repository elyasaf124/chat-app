export interface IChat {
  _id: string;
  active: boolean;
  createdAt: number;
  members: string[];
  activeFor: string[];
}
