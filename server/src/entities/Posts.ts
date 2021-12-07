

import {ObjectType,Field,Int} from 'type-graphql'
import { Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Entity, BaseEntity, ManyToOne } from 'typeorm';
import { User } from './User';

@ObjectType()
@Entity()
export class Post extends BaseEntity{

  @Field(()=>Int)
  @PrimaryGeneratedColumn()
  _id!: number;

  @Field()
  @Column()
  title!: String;

  @Field()
  @Column()
  text!: string

  @Field()
  @Column({type:"int",default:0})
  points!: number

  @Field()
  @Column()
  creatorId:number;

  @ManyToOne(() => User, user => user.posts)
  creator: User;


  @Field(()=>String)
  @CreateDateColumn()
  createdAt: Date;

  
  @Field(()=>String)
  @UpdateDateColumn()
  updatedAt: Date;
  


}


