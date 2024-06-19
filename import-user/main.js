import axios from 'axios';
import mysql from 'mysql';

//创建连接池
const pool = mysql.createPool({
  host: 'rm-bp1qy40map35rz1rtwo.mysql.rds.aliyuncs.com', //服务器地址
  user: 'root', //账号
  password: 'Guomao_123!@#', //密码
  database: 'scm_puxi', //数据库名称
});

const executeQuery = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      connection.query(sql, values, (queryErr, results) => {
        connection.release();

        if (queryErr) {
          reject(queryErr);
        } else {
          resolve(results);
        }
      });
    });
  });
};

const getAllDepartment = async () => {
  const result = await axios({
    url: 'https://oapi.dingtalk.com/topapi/v2/department/listsub?access_token=255dbd908223364c99b08c6a2bda301c',
    method: 'post',
  }).then(result => result.data);

  return result;
};

const getAllUers = async () => {
  const departments = (await getAllDepartment()).result || [];
  const userResult = [];

  for (const department of departments) {
    const { dept_id, name: depName } = department;

    // executeQuery(`INSERT INTO scm_puxi.department
    // (dep_Id,
    // dep_Name,
    // dep_ParentId,
    // dep_Sort,
    // is_Enable,
    // dep_CreateDate,
    // dep_CreateUserId,
    // dep_SalesChannelId)
    // VALUES(
    //  '${dept_id}',
    //  '${depName}',
    // NULL,
    // NULL,
    // NULL,
    // NULL,
    // NULL,
    // NULL);
    // `);

    const {
      result: { list },
    } = await axios({
      url: 'https://oapi.dingtalk.com/topapi/user/listsimple?access_token=255dbd908223364c99b08c6a2bda301c',
      method: 'post',
      data: { dept_id, cursor: 1, size: 10 },
    }).then(result => result.data);

    // userResult.push(...list);

    for (const [index, user] of Object.entries(list)) {
      executeQuery(`
      INSERT INTO scm_puxi.userinfo_department
(user_dep_RelationId,
user_Id,
dep_Id,
is_Leader,
user_dep_CreateDate,
user_dep_CreateUserId)
VALUES
('${user.userid + dept_id}',
'${user.userid}',
'${dept_id}',
NULL,
NULL,
NULL);
`);
    }
  }

  // for (const user of userResult) {
  //   const { userid, name } = user;
  //   executeQuery(`INSERT INTO scm_puxi.userinfo
  //   (user_Id,
  //   user_Name,
  //   user_Password,
  //   user_Avatar,
  //   user_State,
  //   user_Type,
  //   user_Position,
  //   user_Tel,
  //   user_JobTitle,
  //   user_JobNumber,
  //   basic_Id_Company,
  //   user_JoinDate,
  //   user_CreateDate,
  //   user_CreateUserId,
  //   is_Insider,
  //   managerId,
  //   handoverUserId,
  //   feishu_User_Id,
  //   appid,
  //   user_brandId,
  //   user_salesChannelId)
  //   VALUES
  //   ('${userid}',
  //    '${name}',
  //     NULL,
  //     NULL,
  //   1,
  //   NULL,
  //   NULL,
  //   NULL,
  //   NULL,
  //   NULL,
  //   NULL,
  //   NULL,
  //   NULL,
  //   NULL,
  //   NULL,
  //   NULL,
  //   NULL,
  //   NULL,
  //   NULL,
  //   NULL,
  //   NULL)`);
  // }
};

getAllUers();
