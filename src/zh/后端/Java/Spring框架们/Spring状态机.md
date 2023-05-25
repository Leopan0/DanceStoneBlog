---
title: Spring 状态机
isOriginal: true
---

# Spring 状态机

## 参考

> [Spring 状态机官方文档 (spring.io)](https://docs.spring.io/spring-statemachine/docs/1.0.0.M3/reference/htmlsingle/#statemachine-examples-zookeeper)
>
> [Spring Statemachine 状态机初探 - 简书 (jianshu.com)](https://www.jianshu.com/p/5debd91aee9c)
>
> [Spring StateMachine - 代码天地 (codetd.com)](https://www.codetd.com/article/1010726)



状态机这一概念比 `Java` 出现的都要早，Spring 在这一模型的基础上，做出 Spring 状态机 框架。

## 有限状态机

- 有限状态机：简称状态机，是表示有限个状态以及在这些状态之间的转移和动作等行为的数学模型。应用FSM模型可以帮助对象生命周期的状态的顺序以及导致状态变化的事件进行管理。将状态和事件控制从不同的业务Service方法的if else中抽离出来。FSM的应用范围很广，对于有复杂状态流，扩展性要求比较高的场景都可以使用该模型。
  下面是状态机模型中的4个要素，即现态、条件、动作、次态。
  - 现态：是指当前所处的状态。
  - 条件：又称为“事件”。当一个条件被满足，将会触发一个动作，或者执行一次状态的迁移。
  - 动作：条件满足后执行的动作。动作执行完毕后，可以迁移到新的状态，也可以仍旧保持原状态。动作不是必需的，当条件满足后，也可以不执行任何动作，直接迁移到新状态。
  - 次态：条件满足后要迁往的新状态。“次态”是相对于“现态”而言的，“次态”一旦被激活，就转变成新的“现态”了。



## 状态机 DEMO

使用 Spring 状态机要先导入Starter包

```xml
<!--spring statemachine-->
<dependency>
    <groupId>org.springframework.statemachine</groupId>
    <artifactId>spring-statemachine-core</artifactId>
    <version>${state-machine.version}</version>
</dependency>
```



编写相关 Java 配置文件

``` java
@Configuration
// 开启状态机
@EnableStateMachine(name = "Order")
public class StateMachineConfig extends EnumStateMachineConfigurerAdapter<OrderState, OrderEvent> {

    // 状态机初始化
    @Override
    public void configure(StateMachineStateConfigurer<OrderState, OrderEvent> states) throws Exception {
        states.withStates().initial(UNCREATE).states(EnumSet.allOf(OrderState.class));
    }

    // 编写状态机触发流程
    @Override
    public void configure(StateMachineTransitionConfigurer<OrderState, OrderEvent> transitions) throws Exception {
        transitions.withExternal().source(UNCREATE).target(CREATE).event(CREATE_ORDER).and()
                .withExternal().source(CREATE).target(PAIED).event(PAY).and()
                .withExternal().source(PAIED).target(HARVESTED).event(SEND).and()
                .withExternal().source(HARVESTED).target(FINISH).event(CONFIRM);
    }
}
```

状态机流程的相关写法：

- withExternal 是当source和target不同时的写法，比如付款成功后状态发生的变化。
- withInternal 当source和target相同时的串联写法，比如付款失败后都是待付款状态。
- withExterna l的source和target用于执行前后状态、event为触发的事件、guard判断是否执行action。同时满足source、target、event、guard的条件后执行最后的action。
- withChoice 当执行一个动作，可能导致多种结果时，可以选择使用choice+guard来跳转
- withChoice根据guard的判断结果执行first/then的逻辑。
- withChoice不需要发送事件来进行触发。



这里还需要使用两个枚举来表示状态和触发事件

```java
/**
 * 订单状态
 */
public enum OrderState {
    // 未创建
    UNCREATE,
    // 创建,待支付
    CREATE,
    // 已支付，待发货
    PAIED,
    // 待收货
    HARVESTED,
    // 完成
    FINISH;
}
```

```java
/**
 * 订单事件
 */
public enum OrderEvent {
    // 创建订单
    CREATE_ORDER,
    // 支付
    PAY,
    // 发货
    SEND,
    // 确认收货
    CONFIRM;
}
```



### 简单状态机

要保持状态机能够恢复读取，需要将状态机持久化

```java
/**
 * 状态机持久化
 */
@Component
public class OrderStateMachinePersist implements StateMachinePersist<OrderState, OrderEvent, OrderState> {

    @Override
    public void write(StateMachineContext<OrderState, OrderEvent> stateMachineContext, OrderState orderState) throws Exception {
        // 默认不持久化
    }

    @Override
    public StateMachineContext<OrderState, OrderEvent> read(OrderState currentState) throws Exception {
        return new DefaultStateMachineContext<>(currentState, null, null, null);
    }
}
```

```java
/**
 * 注入状态机状态持久化到 Spring容器
 */
@Configuration
public class Config {

    @Autowired
    private OrderStateMachinePersist stateMachinePersist;

    @Bean
    public StateMachinePersister<OrderState, OrderEvent, OrderState> getPersist(){
        return new DefaultStateMachinePersister<>(stateMachinePersist);
    }
}
```



在简单状态流当中，我们设定一个简单的订单场景，订单的状态由状态机管理

```mermaid
graph LR
	UNCREATE --CREATE_ORDER--> CREATE
	CREATE --PAY--> PAIED
	PAIED --SEND--> HARVESTED
	HARVESTED  --CONFIRM--> FINISH
```

然后编写业务流程，运行代码，即完成这样一个简单的 Spring 状态机

```java
@Slf4j
@Service
public class OrderService {

    @Resource
    private StateMachine<OrderState, OrderEvent> stateMachine;
    @Autowired
    private StateMachinePersister<OrderState, OrderEvent, OrderState> machinePersister;

    // 创建订单
    public void createOrder(){
        Message message = MessageBuilder.withPayload(OrderEvent.CREATE_ORDER).setHeader("order", "1").build();
        sendEvent(message, OrderState.UNCREATE);
    }

    // 支付
    public void payed(){
        Message message = MessageBuilder.withPayload(OrderEvent.PAY).setHeader("order", "1").build();
        sendEvent(message, OrderState.CREATE);
    }

    @SneakyThrows
    private void sendEvent(Message message, OrderState currentState){
        stateMachine.start();
        // 恢复状态机到当前订单状态，可由我们控制（该方法实际是重新设置状态机实例状态）
        machinePersister.restore(stateMachine, currentState);
        log.info("事件前状态:{}", stateMachine.getState().getId());
        stateMachine.sendEvent(message);
        log.info("事件后状态:{}", stateMachine.getState().getId());
        stateMachine.stop();
    }
}
```



### 触发事件

​		前面提到如果让状态机状态发生变化，实际业务，状态的变更，也会涉及一系列数据的变更， Spring 状态机提供状态变更监听，来触发我们对应的事件。

```java
@Service
// 监听绑定对应的状态机
@WithStateMachine(name = "Order")
public class OrderStateService {

    @SneakyThrows
    // 监听对应注解
    @OnTransition(source = "UNCREATE", target = "CREATE")
    public void createOrder(Message<OrderEvent> message){
        log.info("创建订单：{}", message.getPayload());
    }
}
```

`@OnTransition` 注解能够监听状态变化，触发对应事件，通过 `Message` 参数，可以获取状态变更传递过来的值。

