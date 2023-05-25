---
title: Spring 数据验证
isOriginal: true
---

# Spring Validation

​		`Spring Validation` 是对 `Hibernate Validation`进行了二次封装，在`Spring MVC` 模块中添加了自动校验，并将校验信息封装进了特定的类中。通过框架，可以轻松完成Spring 的校验。



## 准备工作

使用 `Spring Validation`，需要导入下面这个依赖包

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
    <version>${spring-boot.version}</version>
</dependency>
```



## 使用

### 默认校验

如果使用默认注解进行校验，无需使用其他配置，下面是常用的校验注解：

| 注解                        | 说明                                                     |
| --------------------------- | -------------------------------------------------------- |
| @Null                       | 被注释的元素必须为null                                   |
| @NotNull                    | 被注释的元素必须不为null                                 |
| @AssertTrue                 | 被注释的元素必须为true                                   |
| @AssertFalse                | 被注释的元素必须为false                                  |
| @Min(value)                 | 被注释的元素必须是一个数字，其值必须大于等于指定的最小值 |
| @Max(value)                 | 被注释的元素必须是一个数字，其值必须小于等于指定的最大值 |
| @DecimalMin(value)          | 被注释的元素必须是一个数字，其值必须大于等于指定的最小值 |
| @DecimalMax(value)          | 被注释的元素必须是一个数字，其值必须小于等于指定的最大值 |
| @Size(max, min)             | 被注释的元素的大小必须在指定的范围内                     |
| @Digits (integer, fraction) | 被注释的元素必须是一个数字，其值必须在可接受的范围内     |
| @Past                       | 被注释的元素必须是一个过去的日期                         |
| @Future                     | 被注释的元素必须是一个将来的日期                         |
| @Pattern(value)             | 被注释的元素必须符合指定的正则表达式                     |
| @Email                      | 被注释的元素必须是电子邮箱地址                           |
| @Length                     | 被注释的字符串的大小必须在指定的范围内                   |
| @NotEmpty                   | 被注释的字符串的必须非空                                 |
| @Range                      | 被注释的元素必须在合适的范围内                           |



使用内置默认注解校验，需要在对应属性上加上注解，同时在需要校验的接口上使用`Valid` 注解，在接口所在类加上`Validated` 注解。
```java
import javax.validation.Valid;
import org.springframework.validation.annotation.Validated;
@Validated
public interface IPersonService {
    void savePerson(@Valid Person person);
}
```
内置校验注解支持对返回的消息进行自定义 message 返回错误信息，帮助异常捕捉更好的获取信息。多重校验还可以加不同注解来实现。

```java
@Data
public class Person {

    @NotNull(message = "身份证不能为空")
    @Size(message = "身份证不正确")
    private String idCard;

    @Size(min = 2)
    private String name;

    private String phone;

    @NotNull
    @Email
    private String email;

    private Date birthDate;

    /**
     * true 男性， false 女性
     */
    private boolean sex;
}
```

如果有多个参数需要校验，形式可以如下，即一个校验类对应一个校验结果。

``` java
void funct(@Validated Person person, BindingResult fooBindingResult ，@Validated Bar bar, BindingResult barBindingResult);
```



### 自定义校验

`Spring Validation` 自定义校验需要一些配置，创建自己的校验注解和校验实现

添加自己的校验注解：

```java
@Documented
//此处填写校验实现类
@Constraint(validatedBy = ValidPersonValidator.class)
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidPerson {

    // 默认返回信息
    String message() default "";

    // 必要信息
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
```

添加自己的校验实现

```java
// ValidPerson为校验注解
// Person需要校验的类
public class ValidPersonValidator implements ConstraintValidator<ValidPerson, Person> {

    @SneakyThrows
    @Override
    public boolean isValid(Person person, ConstraintValidatorContext context){
        String msg = "";
        if(person.getIdCard() == null || person.getIdCard().length() != 18){
            msg = "身份证有误";
            // 取消多余message显示
            context.disableDefaultConstraintViolation();
            // 自定义返回msg
            context.buildConstraintViolationWithTemplate(msg).addConstraintViolation();
            return false;
        }
        return true;
    }
}
```

