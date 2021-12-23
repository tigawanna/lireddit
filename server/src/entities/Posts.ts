

import {ObjectType,Field,Int} from 'type-graphql'
import { Column, PrimaryGeneratedColumn, CreateDateColumn, 
  UpdateDateColumn, Entity, BaseEntity, ManyToOne, OneToMany } from 'typeorm';
import { User } from './User';
import { Updoot } from './Updoot';


@ObjectType()
@Entity()
export class Post extends BaseEntity{

  @Field(()=>Int)
  @PrimaryGeneratedColumn()
  _id!: number;

  @Field(() => Int, { nullable: true })
  voteStatus: number | null; // 1 or -1 or null

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
  

  @Field()
  @ManyToOne(() => User, user => user.posts)
  creator: User;

 
  @OneToMany(() => Updoot, (updoot) => updoot.post)
  updoots: Updoot[];


  @Field(()=>String)
  @CreateDateColumn()
  createdAt: Date;

  
  @Field(()=>String)
  @UpdateDateColumn()
  updatedAt: Date;
  


}


