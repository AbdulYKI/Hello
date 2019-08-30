export class UserParams {
  gender: string;
  minAge: number;
  maxAge: number;
  orderBy: OrderBy;
  bring: Bring;
}
export enum OrderBy {
  CREATED = 1,
  LAST_ACTIVE = 2
}
export enum Bring {
  LIKEES = 1,
  LIKERS = 2
}
