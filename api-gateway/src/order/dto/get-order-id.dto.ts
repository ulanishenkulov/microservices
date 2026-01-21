import { IsUUID } from "class-validator";

export class OrderIdParamDto {
  @IsUUID()
  id: string;
}
