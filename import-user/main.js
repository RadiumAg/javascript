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
    url: 'https://oapi.dingtalk.com/topapi/v2/department/listsub?access_token=3e8d60a78d62371f8430fae67712c815',
    method: 'post',
  })
    .then(result => {
      return result.data;
    })
    .catch(e => {
      console.log(e);
    });

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
      url: 'https://oapi.dingtalk.com/topapi/user/listsimple?access_token=3e8d60a78d62371f8430fae67712c815',
      method: 'post',
      data: { dept_id, cursor: 1, size: 10 },
    }).then(result => result.data);

    userResult.push(...list);

    //     for (const [index, user] of Object.entries(list)) {
    //       executeQuery(`
    //       INSERT INTO scm_puxi.userinfo_department
    // (user_dep_RelationId,
    // user_Id,
    // dep_Id,
    // is_Leader,
    // user_dep_CreateDate,
    // user_dep_CreateUserId)
    // VALUES
    // ('${user.userid + dept_id}',
    // '${user.userid}',
    // '${dept_id}',
    // NULL,
    // NULL,
    // NULL);
    // `);
    //     }
    //   }
  }

  for (const user of userResult) {
    const { userid, name } = user;
    try {
      await executeQuery(`UPDATE userinfo set 
  user_JobNumber =  '${userid}'
  WHERE user_Name = '${name}';
  `);
    } catch (e) {
      console.log(e);
    }
  }
};

// getAllUers();

/**
 * 删除所有外键
 */
async function deleteAllKey() {
  const result = await executeQuery(`
SELECT 
    TABLE_NAME, 
    CONSTRAINT_NAME 
FROM 
    INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
WHERE 
    CONSTRAINT_TYPE = 'FOREIGN KEY' 
    AND TABLE_SCHEMA = 'scm_puxi';
`);

  console.log(result);
  for (const re of result) {
    try {
      await executeQuery(
        `ALTER TABLE \`${re.TABLE_NAME}\` DROP FOREIGN KEY \`${re.CONSTRAINT_NAME}\``,
      );
    } catch (e) {
      console.log(e);
    }
  }
}

getAllUers();
