---
title: Redis的各种锁
date: 2024-03-18
tag:
  - Redis
  - Java
category:
  - Java
order: 1
isOriginal: true
---

# Redis的各种锁

Redis一大用处就是系统中的各种锁，下面介绍几种锁的实现。以及他们的区别。

## 乐观锁与悲观锁
乐观锁与悲观锁是锁常用形式，很多中间件都能实现。
#### 应用场景：
通常在高并发的环境下，多个线程去竞争同一个资源，比较常见的有高铁抢票系统，商品秒杀系统等，我们需要保证数据正确，同时系统的吞吐也要尽可能高。
### 两者异同
乐观锁和悲观锁，都是顾名思义，对资源的抢占情况是否乐观决定的，乐观锁通常认为资源没使用，不会去锁住资源。悲观锁则反之。
> 乐观锁是如何保证资源没有锁住时候，正确更新呢？
> 乐观锁在更新前会对数据版本进行比对，不一致则说明情况不太乐观。资源版本不对。

乐观锁相比悲观锁有更高的吞吐量，资源也不会长期占用（IO的切换、加载都是浪费计算资源的事情）
### 乐观锁实现
乐观锁主要有两种实现方式：CAS（Compare and Swap）和版本号控制。
#### 原理
![](https://cdn.nlark.com/yuque/__puml/9b0e246b9756252811aa9359ff7d5d46.svg#lake_card_v2=eyJ0eXBlIjoicHVtbCIsImNvZGUiOiJAc3RhcnR1bWxcbnN0YXJ0XG465omn6KGM6K6h566XO1xuXG5pZiAo5pu05paw5Yiw5pWw5o2u5bqT77yM5qCh6aqM54mI5pys5Y-3KSB0aGVuICjmiJDlip8pXG4gIDrlrozmiJDmnKzmrKHmk43kvZw7XG5lbHNlICjlpLHotKUpXG4gIDrmj5DnpLrmk43kvZzlpLHotKU7XG4gIGVuZFxuZW5kaWZcbnN0b3BcbkBlbmR1bWwiLCJ1cmwiOiJodHRwczovL2Nkbi5ubGFyay5jb20veXVxdWUvX19wdW1sLzliMGUyNDZiOTc1NjI1MjgxMWFhOTM1OWZmN2Q1ZDQ2LnN2ZyIsImlkIjoiS1Z5ZnoiLCJtYXJnaW4iOnsidG9wIjp0cnVlLCJib3R0b20iOnRydWV9LCJjYXJkIjoiZGlhZ3JhbSJ9)优点：吞吐量高
缺点：成功率太低
#### CAS实现
CAS是实现乐观锁的核心算法，它通过比较内存中的值是否和预期的值相等来判断是否存在冲突。如果存在，则返回失败；如果不存在，则执行更新操作。
CAS 它包含了 3 个参数：V（需要更新的变量）、E（预期值）和 N（最新值）。只有当需要更新的变量等于预期值时，需要更新的变量才会被设置为最新值，如果更新值和预期值不同，则说明已经有其它线程更新了需要更新的变量，此时当前线程不做操作，返回 V 的真实值。
```java
public class Counter {
    private AtomicInteger value = new AtomicInteger(0);

    public void increment() {
        int expect;
        int update;

        do {
            // 不断地执行CAS操作，直到更新成功为止。
            expect = value.get();
            update = expect + 1;
        } while (!value.compareAndSet(expect, update));
    }
}
```
#### 版本号控制
版本号控制就是基于资源版本号，更新时比对版本号
```java
@Service
public class OptimisticLockService {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    public boolean updateWithOptimisticLock(String key, String expectedValue, String newValue) {
        ValueOperations<String, String> ops = redisTemplate.opsForValue();
        redisTemplate.watch(key); // 监视键
        String currentValue = ops.get(key);
        
        // 在事务中执行更新操作
        redisTemplate.multi();
        if (currentValue != null && currentValue.equals(expectedValue)) {
            ops.set(key, newValue);
            redisTemplate.exec(); // 提交事务
            return true;
        } else {
            redisTemplate.discard(); // 放弃事务
            return false;
        }
    }
}
```
> orm框架很多都支持`@Version`注解去自动添加版本号

> Redis监视键-事务功能可以保证原子性，除此意外Lua脚本也可以，Redisson客户端封装了一些Lua脚本的方法

### 悲观锁
![](https://cdn.nlark.com/yuque/__puml/70f5e0b4685031720e32dc69d560b63f.svg#lake_card_v2=eyJ0eXBlIjoicHVtbCIsImNvZGUiOiJAc3RhcnR1bWxcbnN0YXJ0XG5pZiAo5p-l6K-i6LWE5rqQ5piv5ZCm6Laz5aSfKSB0aGVuICjotrPlpJ8pXG4gIDrplIHlrprotYTmupA7XG5cdDrmk43kvZzorqHnrpc7XG5cdDrph4rmlL7plIE7XG5lbHNlICjkuI3lpJ8pXG4gIDrmj5DnpLrmk43kvZzlpLHotKU7XG4gIGVuZFxuZW5kaWZcbjrmiafooYzorqHnrpc7XG5zdG9wXG5AZW5kdW1sIiwidXJsIjoiaHR0cHM6Ly9jZG4ubmxhcmsuY29tL3l1cXVlL19fcHVtbC83MGY1ZTBiNDY4NTAzMTcyMGUzMmRjNjlkNTYwYjYzZi5zdmciLCJpZCI6ImQ1OVRLIiwibWFyZ2luIjp7InRvcCI6dHJ1ZSwiYm90dG9tIjp0cnVlfSwiY2FyZCI6ImRpYWdyYW0ifQ==)优点：不会有各种数据安全问题
缺点：吞吐量低，容易造成死锁
```java
@Service
public class PessimisticLockService {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    public boolean acquireLock(String lockKey, long timeoutMillis) {
        // 使用 SETNX 命令尝试获取锁
        Boolean acquired = redisTemplate.opsForValue().setIfAbsent(lockKey, "locked");
        
        // 设置锁的过期时间，防止死锁
        if (acquired != null && acquired) {
            redisTemplate.expire(lockKey, timeoutMillis);
            return true; // 获取锁成功
        } else {
            return false; // 获取锁失败
        }
    }

    public void releaseLock(String lockKey) {
        // 释放锁
        redisTemplate.delete(lockKey);
    }
}
```
> 不同Redis客户端有不同的实现，掌握原理，比如Redisson客户端有很多原子性操作方法。

## 分布式锁
分布式锁的原理是在分布式系统中通过共享资源的方式来控制并发访问，以保证在多个节点或者多个进程间对共享资源的访问是有序的、互斥的。
一般来说，分布式锁的实现需要满足以下几个基本要求：

1.  **互斥性（Mutual Exclusion）**：在任意时刻，只能有一个客户端或者进程持有锁，其他客户端或者进程不能同时持有锁。 
2.  **非阻塞获取锁**：如果一个客户端或者进程尝试获取锁失败，它不能一直阻塞等待锁，而应该以某种方式进行重试或者放弃。 
3.  **容错性（Fault Tolerance）**：当持有锁的客户端或者进程发生故障时，系统应该能够正确处理，确保其他客户端或者进程能够继续获取锁。 
4.  **死锁避免**：系统应该避免因为锁的互相等待而导致死锁的发生。 
5.  **性能高效**：锁的获取和释放操作应该尽可能地高效，不应该成为系统瓶颈。 

分布式锁的实现方式有多种，常见的包括：

-  **基于数据库的实现**：通过数据库的事务特性和行级锁来实现分布式锁，例如在 MySQL 中可以使用 `SELECT ... FOR UPDATE` 语句。 
-  **基于缓存的实现**：通过缓存服务如 Redis、ZooKeeper 等，利用其原子性的特性来实现分布式锁，例如使用 Redis 的 `SETNX` 命令。 
-  **基于文件系统的实现**：通过在文件系统中创建锁文件来实现分布式锁，例如在 NFS、GFS 等分布式文件系统中。 
-  **基于协调服务的实现**：通过专门的分布式协调服务如 ZooKeeper、etcd 等来实现分布式锁，这些服务提供了分布式锁的原子性保证。 

每种实现方式都有其优缺点，具体选择取决于应用场景、性能要求、可用资源等因素。无论哪种实现方式，都需要保证分布式锁的原子性、互斥性和容错性，以确保分布式系统的正确性和可靠性。

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class DistributedLockService {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    public boolean acquireLock(String lockKey, String uniqueIdentifier, long expirationTime) {
        while (true) {
            redisTemplate.watch(lockKey); // 监视键

            String lockValue = redisTemplate.opsForValue().get(lockKey);
            if (lockValue == null || lockValue.equals(uniqueIdentifier)) {
                // 锁不存在或者当前线程持有锁
                redisTemplate.multi(); // 开启事务
                redisTemplate.opsForValue().set(lockKey, uniqueIdentifier);
                redisTemplate.expire(lockKey, expirationTime);
                if (redisTemplate.exec() != null) {
                    return true; // 获取锁成功
                }
            }

            // 放弃监视并重试
            redisTemplate.unwatch();
        }
    }

    public void releaseLock(String lockKey, String uniqueIdentifier) {
        String lockValue = redisTemplate.opsForValue().get(lockKey);
        if (lockValue != null && lockValue.equals(uniqueIdentifier)) {
            redisTemplate.delete(lockKey); // 释放锁
        }
    }
}
```
> 确保在多线程、多客户端并发情况下，获取和释放锁的操作是原子性的，从而保证了分布式锁的正确性。**分布式锁的原子性很重要**

#### 分布式锁的设计考量
当设计分布式锁时，可以考虑以下特性来避免一些常见的分布式问题：

1. **超时机制（Timeout Mechanism）**：为获取锁操作设置超时时间，在一定时间内未能获取到锁，则放弃获取锁，避免长时间等待造成的阻塞。
2. **自旋（Spin）**：在获取锁失败时进行一定次数的自旋尝试，避免频繁地重新请求锁。
3. **可重入性（Reentrancy）**：允许同一个客户端或者线程在持有锁的情况下重复获取锁，避免死锁的发生。
4. **公平性（Fairness）**：保证锁的获取是按照请求的顺序进行处理，避免某些请求长时间被阻塞，导致饥饿问题。
5. **锁的续约（Lock Renewal）**：在持有锁的客户端或者进程在锁的过期时间内未释放锁时，允许续约锁的有效期，避免因为锁的过期而导致的资源浪费和锁的重新获取。
6. **支持多种数据结构**：除了基本的互斥锁之外，还可以支持更多的数据结构，例如读写锁、信号量等，以满足不同场景下的需求。
7. **监控和管理**：提供监控和管理功能，例如锁的持有情况、锁的过期时间等信息，方便运维人员进行监控和故障排查。
8. **限流和降级**：在高并发情况下，可以对锁的获取进行限流，以避免系统过载，同时可以考虑实现降级策略，当无法获取锁时，采取备用方案保证系统的可用性。

综合考虑以上特性可以帮助设计出更加健壮、可靠的分布式锁系统，从而提高系统的性能和可用性。
```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class DistributedLockService {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    private ThreadLocal<Integer> reentrantCounter = ThreadLocal.withInitial(() -> 0);

    public boolean acquireLock(String lockKey, String uniqueIdentifier, long expirationTime, long timeoutMillis, int spinCount) throws InterruptedException {
        long startTime = System.currentTimeMillis();
        while (true) {
            long currentTime = System.currentTimeMillis();
            if (currentTime - startTime > timeoutMillis) {
                return false; // 超时未能获取锁
            }

            boolean acquired = redisTemplate.opsForValue().setIfAbsent(lockKey, uniqueIdentifier);
            if (acquired) {
                // 设置锁的过期时间，防止死锁
                redisTemplate.expire(lockKey, expirationTime);
                reentrantCounter.set(1); // 记录重入次数
                return true; // 获取锁成功
            }

            // 自旋尝试获取锁
            for (int i = 0; i < spinCount; i++) {
                acquired = redisTemplate.opsForValue().setIfAbsent(lockKey, uniqueIdentifier);
                if (acquired) {
                    redisTemplate.expire(lockKey, expirationTime);
                    reentrantCounter.set(1); // 记录重入次数
                    return true; // 获取锁成功
                }
            }

            Thread.sleep(10); // 避免自旋过快导致 CPU 消耗过高
        }
    }

    public boolean reentrantLock(String lockKey, String uniqueIdentifier, long expirationTime) {
        Integer count = reentrantCounter.get();
        if (count != null && count > 0) {
            reentrantCounter.set(count + 1); // 增加重入次数
            return true;
        } else {
            // 重入次数不合法
            return false;
        }
    }

    public void releaseLock(String lockKey, String uniqueIdentifier) {
        Integer count = reentrantCounter.get();
        if (count != null && count > 1) {
            reentrantCounter.set(count - 1); // 减少重入次数
        } else {
            redisTemplate.delete(lockKey); // 释放锁
            reentrantCounter.remove(); // 移除线程本地变量
        }
    }
}
```
## 参考
[https://www.cnblogs.com/Conwie/p/14576514.html](https://www.cnblogs.com/Conwie/p/14576514.html)
[Java乐观锁的实现原理和典型案例-CSDN博客](https://blog.csdn.net/lomodays207/article/details/130201917)
