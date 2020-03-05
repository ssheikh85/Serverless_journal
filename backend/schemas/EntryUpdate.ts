import "reflect-metadata";
import { Field, ObjectType } from "type-graphql";

//Creates a graphQL schema for an entry update
@ObjectType()
export class EntryUpdate {
  @Field()
  content: string;
}
