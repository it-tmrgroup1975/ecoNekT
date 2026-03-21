export interface Employee {
  id: number;
  employee_code: string;

  first_name: string;
  last_name: string;
  user: {
    email: string;
    first_name: string;
    last_name: string;
  };
  position_details?: {
    title: string;
    department_name: string;
  };
  avatar: string | null | undefined;
  skills: string[];
  joined_at: string;
}