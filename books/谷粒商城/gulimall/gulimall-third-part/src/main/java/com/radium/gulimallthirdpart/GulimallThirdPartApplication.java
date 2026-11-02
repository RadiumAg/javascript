package com.radium.gulimallthirdpart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

// common 传递依赖了 mybatis-plus starter，但第三方服务不连数据库，排除数据源自动配置
@EnableDiscoveryClient
@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)
public class GulimallThirdPartApplication {

    public static void main(String[] args) {
        SpringApplication.run(GulimallThirdPartApplication.class, args);
    }

}
