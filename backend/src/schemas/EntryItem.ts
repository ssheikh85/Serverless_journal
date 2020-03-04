import "reflect-metadata";
import { Field, ObjectType } from "type-graphql";

//Creates a graphQL schema for an entry item
@ObjectType()
export class EntryItem {
  @Field()
  userId: string;

  @Field()
  entryId: string;

  @Field()
  createdAt: string;

  @Field()
  content: string;

  @Field({ nullable: true })
  attachmentUrl?: string;
}
