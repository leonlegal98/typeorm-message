import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

import { Message } from "./Message";

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column()
    email: string;

    @Column("text")
    password: string;

    @OneToMany(() => Message, message => message.user)
    messages: Message[];
}