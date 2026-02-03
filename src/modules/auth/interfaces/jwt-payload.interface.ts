import { Role } from '../../../shared/enums/role.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  institutionId: string | null;
  iat?: number;
  exp?: number;
}
