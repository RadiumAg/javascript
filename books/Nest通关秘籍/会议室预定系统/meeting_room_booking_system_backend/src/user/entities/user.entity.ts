import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, comment: '用户名' })
  username: string;

  @Column({ length: 50, comment: '密码' })
  password: string;

  @Column({ name: 'nick_name', length: 50, comment: '昵称' })
  nickName: string;

  @Column({ comment: '邮箱', length: 50 })
  email: string;

  @Column({ comment: '头像', length: 100, nullabl: true })
  headPic: string;

  @Column({
    comment: '手机号',
    length: 20,
    nullable: true,
  })
  phoneNumber: string;

  @Column({ comment: '是否冻结', default: false })
  isFrozen: boolean;

  @Column({ comment: '是否是管理员', default: false })
  isAdmin: boolean;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @ManyToMany(() => Role)
  @JoinColumn({ name: 'user_roles' })
  roles: Role[];
}
