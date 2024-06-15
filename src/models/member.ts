// member.ts
export interface Member {
  id?: number;
  email: string;
  password: string;
  departmentId: number;
  roleId: number;
  name: string;
  cpf: string;
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}
