import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("notes")
export class NoteEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  content!: string;
}
