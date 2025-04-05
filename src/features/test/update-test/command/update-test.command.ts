import { Length } from "class-validator";

export class UpdateTestCommand {
  @Length(2, 50)
  name: string;

  @Length(2, 100)
  description: string;
}