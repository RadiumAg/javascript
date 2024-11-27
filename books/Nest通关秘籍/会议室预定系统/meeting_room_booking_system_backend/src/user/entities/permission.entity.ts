import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'permissions',
})
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 20,
    comment: '代码权限',
  })
  code: string;

  @Column({
    length: 100,
    comment: '权限名称',
  })
  description: string;
}
