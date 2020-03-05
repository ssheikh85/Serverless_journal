import "reflect-metadata";
import { Field, InputType } from "type-graphql";
import { EntryItem } from "../schemas/EntryItem";

//Creates a graphQL input type for creating a new entry using the EntryItem class as an interface
@InputType()
export class EntryInput implements Partial<EntryItem> {
  @Field()
  content: string;
}
