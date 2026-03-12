import { IsInt, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class BindEmployeeDto {
  @IsString()
  @IsNotEmpty()
  bindToken: string;

  @IsString()
  @IsNotEmpty()
  employeeNo: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsPhoneNumber('CN')
  phone: string;

  @IsInt()
  departmentId: number;
}
