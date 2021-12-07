

import {ObjectType,Field} from 'type-graphql'
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity, OneToMany } from 'typeorm';
import { Post } from './Posts';


@ObjectType()
@Entity()
export class User extends BaseEntity{

  @Field()
  @PrimaryGeneratedColumn()
  _id!: number;

  @Field()
  @Column({unique:true})
  username: string;


  @Field()
  @Column({unique:true})
  email: string
  

  @Column()
  password: string;



  @OneToMany(() => Post, post => post.creator)
  posts: Post[];


  @Field()
  @CreateDateColumn()
  createdAt: Date 

  
  @Field(()=>String)
  @UpdateDateColumn()
  updatedAt: Date;

  


 
  


}


