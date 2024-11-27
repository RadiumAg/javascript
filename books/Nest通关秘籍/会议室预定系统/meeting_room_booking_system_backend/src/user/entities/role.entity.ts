import { Column, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, comment: '角色名' })
  name: string;

  @ManyToMany(() => Permission)
  @JoinTable({ name: 'role_permissions' })
  permissions: Permission[];
}
