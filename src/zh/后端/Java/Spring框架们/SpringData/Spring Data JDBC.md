---
tag:
 - Java
 - Spring Data
category:
  - Java
date: 2023-05-25
---

# Spring Data JDBC

### 准备工作

Spring Data JDBC 是对 JDBC Template 的封装，简化对JDBC数据库连接的操作。在Spring Boot当中，使用JDBC只需要两个包 Spring Data JDBC 的 Starter 包和 数据库驱动包

> JDBC Starter 包 内含的Spring Core模块可能会和本身 Spring Boot 内含 Spring Core模块出现版本替换到最新，导致版本不兼容问题

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jdbc</artifactId>
    <version>${jdbc.template.version}</version>
</dependency>
```

配置项上和常规数据库连接配置相同，下面使用的是Mysql配置

```properties
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/demo?useUnicode=true&characterEncoding=utf8&useSSL=false&rewriteBatchedStatements=true&serverTimezone=GMT%2b8&nullCatalogMeansCurrent=true
spring.datasource.username=
spring.datasource.password=
spring.datasource.type=com.zaxxer.hikari.HikariDataSource
spring.datasource.hikari.auto-commit=true
```



### 单条数据执行

JDBC 查询单挑数据，注入JdbcTemplate 即可

```java
@Autowired
public PersonService(JdbcTemplate jdbcTemplate,
                     NamedParameterJdbcTemplate namedParameterJdbcTemplate){
    this.jdbcTemplate = jdbcTemplate;
    this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
}
```

使用示例：

```java
// 查询
public Person query(String id){
    Person person = jdbcTemplate.queryForObject("select * from tb_person where id = ?", rowMapper, id);
    return person;
}

// 保存
public int savePeron(Person person){
    Object[] args = new Object[3];
    args[0] = person.getId();
    args[1] = person.getName();
    args[2] = person.getIdCard();
    return jdbcTemplate.update("insert into tb_person values (?,?,?)", args);
}

// 删除
public int deletePerson(String id){
    return jdbcTemplate.update("delete from tb_person where id = ?", id);
}

// 修改
public int updatePerson(Person person){
    return jdbcTemplate.update("update tb_person set name = ? where id = ?", person.getName(), person.getId());
}
```

查询有一个 `rowMapper` 参数，是jdbc 对查询结果的映射，需要自己编写，这样方便我们接收查询结果。

```java
/**
 * 数据映射
 */
private RowMapper<Person> rowMapper = new RowMapper<Person>() {
    @Override
    public Person mapRow(ResultSet resultSet, int i) throws SQLException {
        Person person = Person.builder().id(resultSet.getString("id"))
            .name(resultSet.getString("name"))
            .idCard(resultSet.getString("id_card"))
            .build();
        return person;
    }
};
```



### 批量执行

#### JdbcTemplate

对于批量执行，使用JdbcTemplate可以做，如下:

```java
/**
 * 批量查询
 * @return
 */
public List<Person> queryList(){
    List<Person> personList = jdbcTemplate.query("select * from tb_person", rowMapper);
    return personList;
}

/***
 * 批量保存
 * @param people
 * @return 返回-2是数据库驱动问题
 */
public int[] saveAll(List<Person> people){
    // 方法1
    List<Object[]> args = new ArrayList<>();
    for (Person person : people) {
        Object[] arg = new Object[3];
        arg[0] = person.getId();
        arg[1] = person.getName();
        arg[2] = person.getIdCard();
        args.add(arg);
    }
    int[] ints1 = jdbcTemplate.batchUpdate("insert into tb_person values (?,?,?)", args);
    // 方法2
    int[] ints2 = namedParameterJdbcTemplate.batchUpdate("insert into tb_person values (:id,:name,:IdCard)", SqlParameterSourceUtils.createBatch(people));
    return ints2;
}
```



#### NamedParameterJdbcTemplate

可以看到，使用查询时候，JdbcTemplate还算方便，涉及修改操作，JdbcTemplate就稍显麻烦，JDBC框架提供了一系列的工具方便复杂场景使用。NamedParameterJdbcTemplate就是一个，可以通过对sql中的参数命名，帮助我们操作。上述批量保存方法中，方法就是使用了NamedParameterJdbcTemplate的批量保存。其他批量操作也非常简单。

```java
/**
 * 批量删除
 * @param idList
 * @return
 */
public int deletePerson(List<String> idList){
    Map<String, Object> params = new HashMap<>();
    params.put("param", idList);
    int update = namedParameterJdbcTemplate.update("delete from tb_person where id in (:param)", params);
    return update;
}
```

我们可以使用 `:参数名` 的形式替换 JdbcTemplate 中的`?` ，通过

```java
Map<String, Object> params = new HashMap<>();
```

来传递参数，Map的key就对应填入参数的位置。

这里还使用了框架内置的SqlParameterSourceUtils静态工具提供的批处理转换方法。

