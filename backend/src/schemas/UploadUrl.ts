import "reflect-metadata";
import { Field, ObjectType } from "type-graphql";

//Creates a graphQL schema for an UploadUrl
@ObjectType()
export class UploadUrl {
  @Field()
  UploadUrl: string;
}
