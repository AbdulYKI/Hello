export class UserParams {
  gender: string;
  minAge: number;
  maxAge: number;
  orderBy: OrderBy;
}
export enum OrderBy {
  CREATED = 1,
  LAST_ACTIVE = 2
}
