---
title: '[java-live-study] 12주차-애너테이션(Annotation)'
date: 2021-03-05 19:26:00
category: 'java-live-study'
draft: false
---

![click to enlarge](images/whiteship-logo.jpg)

자바에는 특수한 목적의 참조 타입이 두 가지가 있다. 하나는 11주차에 다룬 클래스의 일종인 **열거 타입(enum, 열거형)**이고, 다른 하나는 **애너테이션(annotation)**이다.

## 애너테이션

- 애너테이션은 코드에 대한 정보를 제공하는 메타 데이터의 일종이다.
- JDK1.5에 나와서 현재 Hibernate, Spring, Springboot 등 광범위하게 쓰이고 있다.
- 컴파일 시에 애너테이션을 사용해 오류 및 경고를 알려 줄 수 있다.

### 정의하는 방법

`@interface` 키워드를 통해 커스텀 애너테이션을 정의할 수 있다.

```java
접근제어자 @interface 어노테이션명 {
    ...
}

public @interface CustomAnnotation {
    ...
}
```

애너테이션에 선언된 메서드의 반환 타입은 반드시 아래 타입 중 하나여야만 한다.

- 기본형(primitive type)
- 문자열(String)

  - 애너테이션은 요소 개수에 따라 서로 다르게 불린다.

    - 요소를 갖지 않는 marker annotation

      ```java
      @interface Marker {}
      ```

    - 하나의 요소를 갖는 single-element annotation

      관례적으로 요소의 이름을 `value`라 짓는다.

      ```java
      @interface Copyright {
          String value();
      }

      @interface Endorsers {
          String[] value();
      }
      ```

    - 여러 개의 요소를 갖는 애너테이션

      ```java
      @interface RequestForEnhancement {
          int id(); // Unique ID number associated with RFE
          String synopsis(); // Synopsis of RFE
          String engineer(); // Name of engineer who implemented RFE
          String date(); // Date RFE was implemented
      }
      ```

- 클래스

  ```java
  interface Formatter {}
  // Designates a formatter to pretty-print the annotated class
  @interface PrettyPrinter {
      Class<? extends Formatter> value();
  }
  ```

- 열거 타입(enum)

  ```java
  @interface Quality {
      enum Level { BAD, INDIFFERENT, GOOD }
      Level value();
  }
  ```

- 애너테이션

  ```java
  @interface Author {
      Name value();
  }

  @interface Name {
      String first();
      String last();
  }
  ```

- 위의 타입으로 구성된 배열

## 메타 애너테이션

애너테이션을 위한 애너테이션으로 `java.lang.annotation`에 정의되어 있다.

### **@Target**

애너테이션이 적용될 요소의 종류를 나타낸다. 가능한 값으로는 TYPE, METHOD, CONSTRUCTOR, FIELD 등이 있다.

```java
@Target({적용될 요소의 종류})

@Target({ElementType.METHOD, ElementType.CONSTRUCTOR})
```

### **@Retention**

애너테이션이 유지되는 범위를 나타낸다. 가능한 값으로는 SOURCE, CLASS, RUNTIME이 있다.

```java
@Retention(유지되는 범위)

@Retention(RetentionPolicy.RUNTIME)
```

### **@Documented**

애너테이션 정보를 javadoc 문서에 포함시킨다.

## 애너테이션 프로세서

애너테이션 프로세서는 컴파일 타임에 애너테이션을 스캔해서 처리하는 javac에 속한 빌드툴(hook)이다. 롬복(Lombok)라이브러리도 이에 속한다.

애너테이션 프로세서가 좋은 이유는 런타임 시점이 아닌 컴파일 시점에 쓰이므로 런타임에 대한 비용이 들지 않는다. 하지만 컴파일러 내부 클래스를 사용하여 기존 코드를 조작하므로 사용에 있어서 유의해야 한다.

애너테이션 프로세서는 AbstractProcessor 클래스를 상속받아 생성할 수 있다.

```java
package javax.annotation.processing;

import java.util.List;
import java.util.Set;
import java.util.HashSet;
import java.util.Collections;
import java.util.Objects;
import javax.lang.model.element.*;
import javax.lang.model.SourceVersion;
import javax.tools.Diagnostic;

/**
 * An abstract annotation processor designed to be a convenient
 * superclass for most concrete annotation processors.  This class
 * examines annotation values to compute the {@linkplain
 * #getSupportedOptions options}, {@linkplain
 * #getSupportedAnnotationTypes annotation types}, and {@linkplain
 * #getSupportedSourceVersion source version} supported by its
 * subtypes.
 *
 * <p>The getter methods may {@linkplain Messager#printMessage issue
 * warnings} about noteworthy conditions using the facilities available
 * after the processor has been {@linkplain #isInitialized
 * initialized}.
 *
 * <p>Subclasses are free to override the implementation and
 * specification of any of the methods in this class as long as the
 * general {@link javax.annotation.processing.Processor Processor}
 * contract for that method is obeyed.
 *
 * @author Joseph D. Darcy
 * @author Scott Seligman
 * @author Peter von der Ah&eacute;
 * @since 1.6
 */
public abstract class AbstractProcessor implements Processor {
    /**
     * Processing environment providing by the tool framework.
     */
    protected ProcessingEnvironment processingEnv;
    private boolean initialized = false;

    /**
     * Constructor for subclasses to call.
     */
    protected AbstractProcessor() {}

      ...
}
```
