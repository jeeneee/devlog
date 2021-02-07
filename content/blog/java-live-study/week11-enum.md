---
title: '[java-live-study] 11주차-열거 타입(Enum)'
date: 2021-02-07 20:27:00
category: 'java-live-study'
draft: false
---

![click to enlarge](images/whiteship-logo.jpg)

자바에는 특수한 목적의 참조 타입이 두 가지가 있다. 하나는 클래스의 일종인 **열거 타입(enum, 열거형)**이고, 다른 하나는 12주차에 다룰 내용인 **애너테이션(annotation)**이다.

## 상수 vs 열거 타입

JDK1.5부터 열거 타입을 지원하기 전까진 **정수 열거 패턴(int enum pattern)**을 사용하였다.

```java
public class DirectionConstant {
    public static final int EAST  = 0;
    public static final int SOUTH = 1;
    public static final int WEST  = 2;
    public static final int NORTH = 3;
}
```

이는 단지 여러 개의 정수 상수를 선언한 것으로, **타입 안전(type safety)**을 보장할 방법이 없으며 표현력도 좋지 않다. 또한 자바는 다른 언어와 달리 **이름공간(namespace)**을 지원하지 않기 때문에 이름 충돌이 생길 가능성이 다분하다. 게다가 상수의 값이 바뀌면 클라이언트도 반드시 다시 컴파일 해야 한다.

```java
public enum Direction {
    EAST, SOUTH, WEST, NORTH
}
```

자바에서의 열거 타입은 겉보기에 다른 언어와 같아 보이지만 완전한 형태의 클래스라서 다른 언어의 열거 타입보다 훨씬 강력한 기능을 제공한다.

- 상수마다 해당 타입의 인스턴스로 만들어 `public static final`필드로 공개한다.
- 열거 타입도 클래스이기 때문에 생성자가 존재하지만 일반적인 클래스와 달리 접근 제어자가 `private`이다. 외부에서 접근이 불가하므로 `final`이라 볼 수 있다.

enum의 실제 구현과는 많이(?) 다르지만 아래 코드와 같은 클래스라 이해하면 쉬울 것이다.

```java
public class Direction {

    public static final Direction EAST  = new Direction("EAST");
    public static final Direction SOUTH = new Direction("SOUTH");
    public static final Direction WEST  = new Direction("WEST");
    public static final Direction NORTH = new Direction("NORTH");

    private final String name;

    private Direction(String name) {
        this.name = name;
    }
}
```

따라서 열거 타입은 싱글턴(singleton)을 일반화한 형태이다. 이런 특성으로 싱글턴을 구현하는 하나의 방법으로 사용되기도 한다.

```java
public class TypeSafety {

    public static void main(String[] args) {
        enumEx(Direction.EAST);
        enumEx(Direction.SOUTH);
        enumEx(Direction.WEST);
        enumEx(Direction.NORTH);
        enumEx(null);

        constantEx(0);
        constantEx(1);
        constantEx(2);
        constantEx(3);
        constantEx(4);
    }

    private static void enumEx(Direction dir) {
        if (dir == Direction.EAST) System.out.println("EAST");
        else if (dir == Direction.SOUTH) System.out.println("SOUTH");
        else if (dir == Direction.WEST) System.out.println("WEST");
        else System.out.println("NORTH");
    }

    private static void constantEx(int dir) {
        if (dir == DirectionConstant.EAST) System.out.println("EAST");
        else if (dir == DirectionConstant.SOUTH) System.out.println("SOUTH");
        else if (dir == DirectionConstant.WEST) System.out.println("WEST");
        else System.out.println("NORTH");
    }
}
```

위의 예를 살펴보면 정수 열거 패턴을 사용할 때 두 가지 문제점이 존재한다.

1. `constantEx` 메서드의 매개변수로 모든 int형 정수가 가능한 것에 반해 `enumEx` 메서드엔 오로지 해당 **열거 타입** 또는 **null**만 전달 가능하므로 타입 안전성을 제공한다.
2. `DirectionConstant`클래스에서 상수 값을 변경해도 위의 코드에선 어떠한 예외도 발생하지 않는다. 반면에 열거 타입 상수를 변경하면 프로그램은 작동 안 할지 몰라도 런타임 에러가 아닌 컴파일타임 에러를 발생시킬 수 있다.

열거 타입의 장점은 이뿐만 아니라 필드나 메서드를 추가할 수 있고 인터페이스도 구현하게 할 수도 있다.

## 정의하는 방법

위의 Direction처럼 단순히 열거체를 나열하는 방법이 있으며 필드나 메서드를 추가할 수도 있다.

```java
public enum Direction {
    EAST(1, 0), SOUTH(0, -1), WEST(-1, 0), NORTH(0, 1);

    private final int dx;
    private final int dy;

    Direction(int dx, int dy) {
        this.dx = dx;
        this.dy = dy;
    }

    public int getDx() { return dx; }
    public int getDy() { return dy; }

}

public class Point {

    private int x, y;

    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public void move(Direction dir, int step) {
        x += dir.getDx() * step;
        y += dir.getDy() * step;
    }

    @Override
    public String toString() {
        return "Point{" + "x=" + x + ", y=" + y + '}';
    }
}

public class App {

    public static void main(String[] args) {
        Point p = new Point(0, 0);
        p.move(Direction.EAST, 5);
        p.move(Direction.NORTH, 3);
        System.out.println(p); // Point{x=5, y=3}
    }
}
```

좌표 평면 상의 점을 동서남북으로 이동시키는 코드이다. 열거 타입을 사용함으로써 더욱 명시적이고 타입에 안전한 코드가 되었다. 만일 EAST, SOUTH, WEST, NORTH가 아닌 값을 넣으면 컴파일 에러가 발생할 것이다.

상수마다 다른 동작을 필요로 할 때도 열거 타입을 활용할 수 있을까? 먼저 switch문을 이용해 상수 값에 따라 분기하는 방법을 시도해보자.

```java
public enum Operation {
    PLUS, MINUS, TIMES, DIVIDE;

    public double apply(double x, double y) {
        switch (this) {
            case PLUS:   return x + y;
            case MINUS:  return x - y;
            case TIMES:  return x * y;
            case DIVIDE: return x / y;
        }
        throw new AssertionError("알 수 없는 연산: " + this);
    }
}
```

동작은 하지만 깨지기 쉬운 코드이다. 예컨대 새로운 상수를 추가하면 해당 case문을 추가해야 한다. 그렇지 않으면 해당 상수에 접근 시에 런타임 에러가 발생할 것이다. 다행히 열거 타입은 상수별 메서드 구현이 가능하다. 즉, 추상 메서드를 선언하고 각 상수별로 재정의가 가능하다.

```java
public enum Operation {
    PLUS   {public double apply(double x, double y) { return x + y; }},
    MINUS  {public double apply(double x, double y) { return x - y; }},
    TIMES  {public double apply(double x, double y) { return x * y; }},
    DIVIDE {public double apply(double x, double y) { return x / y; }};

    public abstract double apply(double x, double y);
}
```

이렇게 되면 새로운 상수를 추가할 때 추상 메서드를 재정의할 수 밖에 없을 것이다. 만일 깜빡했더라도 컴파일 에러가 발생한다. 여기에 더 나아가서 상수별 메서드 구현을 상수별 데이터와 결합할 수 있다.

```java
public enum Operation {
    PLUS("+")   {public double apply(double x, double y) { return x + y; }},
    MINUS("-")  {public double apply(double x, double y) { return x - y; }},
    TIMES("*")  {public double apply(double x, double y) { return x * y; }},
    DIVIDE("/") {public double apply(double x, double y) { return x / y; }};

    private final String symbol;

    Operation(String symbol) { this.symbol = symbol; }

    public String toString() { return symbol; }
    public abstract double apply(double x, double y);
}

public class App {

    public static void main(String[] args) {
        double x = 2.0;
        double y = 4.0;
        for (Operation op : Operation.values()) {
            System.out.printf("%f %s %f = %f%n", x, op, y, op.apply(x, y));
        }
    }
}
```

```
2.000000 + 4.000000 = 6.000000
2.000000 - 4.000000 = -2.000000
2.000000 * 4.000000 = 8.000000
2.000000 / 4.000000 = 0.500000
```

## 열거 타입이 제공하는 메서드

- **values()** - 열거 타입 안에 정의된 상수들의 값을 선언된 순서대로 해당 열거 타입의 배열에 담아 반환하는 정적 메서드이다.  
  `Direction[] dirs = Direction.values();`
- **valueOf(String name)** - 매개변수로 주어진 이름과 일치하는 열거 타입의 참조를 반환한다.  
  `Direciton dir = Direction.valueOf("EAST")`

한 가지 특징은 두 메서드가 컴파일러에 의해 정의된다는 점이다. 그렇기 때문에 해당 바이트 코드에서 메서드를 확인할 수 있다.

```java
// access flags 0x9
public static values()[Lweek11/Direction;
 L0
  LINENUMBER 3 L0
  GETSTATIC week11/Direction.$VALUES : [Lweek11/Direction;
  INVOKEVIRTUAL [Lweek11/Direction;.clone ()Ljava/lang/Object;
  CHECKCAST [Lweek11/Direction;
  ARETURN
  MAXSTACK = 1
  MAXLOCALS = 0

// access flags 0x9
public static valueOf(Ljava/lang/String;)Lweek11/Direction;
 L0
  LINENUMBER 3 L0
  LDC Lweek11/Direction;.class
  ALOAD 0
  INVOKESTATIC java/lang/Enum.valueOf (Ljava/lang/Class;Ljava/lang/String;)Ljava/lang/Enum;
  CHECKCAST week11/Direction
  ARETURN
 L1
  LOCALVARIABLE name Ljava/lang/String; L0 L1 0
  MAXSTACK = 2
  MAXLOCALS = 1
```

- **String name()** - 열거 타입에 선언된 상수의 이름을 문자열로 반환한다.

  `Direction.EAST.name()`

- **int ordinal()** - 열거 타입 상수가 해당 열거 타입에서 몇 번째 위치인지를 반환한다.

  `Direction.EAST.ordinal == 0` // true (0부터 시작)

- **Class<T> getDeclaringClass()** - 열거 타입의 class 객체를 반환한다.

## java.lang.Enum

**java.lang.Enum** 클래스는 모든 열거 타입의 상위 클래스이며, 우리가 작성한 모든 열거 타입은 컴파일러에 의해 묵시적으로 Enum 클래스를 상속받게 된다. 그렇기에 다른 어떠한 클래스도 상속받을 수 없다. 위의 바이트 코드의 Direction 열거 타입의 선언부는 다음과 같다.

```java
public final enum week11/Direction extends java/lang/Enum {

public abstract class Enum<E extends Enum<E>>
        implements Comparable<E>, Serializable {
```

**Enum** 추상 클래스를 보면 **Comparable<E>**과 **Serializable**을 구현하고 있음을 볼 수 있다. 따라서 서로 비교 가능하고 직렬화가 가능하다.

## EnumSet

열거한 값들이 집합으로 사용될 경우, 예전에는 각 상수에 서로 다른 2의 거듭제곱 값을 할당한 정수 열거 패턴을 사용해왔다.

```java
public class Text {
    public static final int STYLE_BOLD          = 1 << 0;
    public static final int STYLE_ITALIC        = 1 << 1;
    public static final int STYLE_UNDERLINE     = 1 << 2;
    public static final int STYLE_STRIKETHROUGH = 1 << 3;

    public void applyStyles(int styles) {...}
}

text.applyStyles(STYLE_BOLD | STYLE_UNDERLINE) // == 5
```

비트별 OR연산을 통해 여러 상수를 하나의 집합으로 모을 수가 있는데, 이렇게 만들어진 집합을 **비트 필드(bit field)**라 한다.

이와 같은 방법은 여러 단점이 존재한다.

- 앞서 언급한 정수 열거 패턴의 단점을 그대로 갖는다.
- 비트 필드 값을 해석하기가 어렵다.
- 비트 필드 하나에 있는 모든 원소를 순회하기가 까다롭다.
- 최대 몇 비트가 필요한지 미리 예측해야 하고 추후 수정이 까다롭다.

**java.util.EnumSet** 클래스는 열거 타입 상수의 값으로 구성된 집합을 효과적으로 표현해준다. **Set** 인터페이스를 완벽히 구현하며, 타입 안전성이 보장되고 또 다른 **Set** 구현체와도 함께 사용할 수 있다.

```java
public abstract class EnumSet<E extends Enum<E>> extends AbstractSet<E>
    implements Cloneable, java.io.Serializable {
    ...
    public static <E extends Enum<E>> EnumSet<E> noneOf(Class<E> elementType) {
        Enum<?>[] universe = getUniverse(elementType);
        if (universe == null)
            throw new ClassCastException(elementType + " not an enum");

        if (universe.length <= 64)
            return new RegularEnumSet<>(elementType, universe);
        else
            return new JumboEnumSet<>(elementType, universe);
    }
    ...
}
```

위의 코드를 보면 눈치 챌 수도 있는데 **EnumSet**의 내부는 비트 벡터로 구현되었다. `noneOf` 메서드는 주어진 열거 타입에 해당하는 빈 **EnumSet**을 반환하는데, 원소가 64개 이하라면 long 변수 하나로 표현하는 **RegularEnumSet**이 반환하고, 65개 이상이라면 long 배열로 표현하는 **JumboEnumSet**이 반환한다.

앞의 예를 **열거 타입**과 **EnumSet**을 이용해 수정하면 다음과 같다.

```java
public class Text {
    public enum Style { BOLD, ITALIC, UNDERLINE, STRIKETHROUGH };

    public void applyStyles(Set<Style> styles) {...}
}

text.applyStyles(EnumSet.of(Style.BOLD, Style.UNDERLINE));
```

### EnumSet 메서드

- **public static <E extends Enum<E>> EnumSet<E> noneOf(Class<E> elementType)**

  주어진 요소 타입으로 비어있는 EnumSet을 생성한다.

- **public static <E extends Enum<E>> EnumSet<E> allOf(Class<E> elementType)**

  주어진 요소 타입의 모든 요소를 포함하는 EnumSet을 생성한다.

- **public static <E extends Enum<E>> EnumSet<E> copyOf(EnumSet<E> s)**

  주어진 EnumSet과 동일한 타입을 사용하여 동일한 요소를 포함하는 EnumSet을 생성한다. **Cloneable**을 구현하기 때문에 구현부는 단지 `return s.clone();`이다.

- **public static <E extends Enum<E>> EnumSet<E> complementOf(EnumSet<E> s)**

  주어진 EnumSet에 포함되지 않은 요소들로 구성된 EnumSet을 생성한다.

- **public static <E extends Enum<E>> EnumSet<E> of(E e)**

  **public static <E extends Enum<E>> EnumSet<E> of(E e1, E e2)**

  **public static <E extends Enum<E>> EnumSet<E> of(E e1, E e2, E e3)**

  **public static <E extends Enum<E>> EnumSet<E> of(E e1, E e2, E e3, E e4)**

  **public static <E extends Enum<E>> EnumSet<E> of(E e1, E e2, E e3, E e4, E e5)**

  **public static <E extends Enum<E>> EnumSet<E> of(E first, E... rest)**

  주어진 요소들로 구성된 EnumSet을 생성한다. 매개변수를 가변인수로 받는 메서드도 있지만 속도 측면에서 불리하다.

- **public static <E extends Enum<E>> EnumSet<E> range(E from, E to)**

  열거 상수 from과 to 범위 안에 있는 모든 요소를 포함하는 EnumSet을 생성한다.

  ```java
  public enum Style { BOLD, ITALIC, UNDERLINE, STRIKETHROUGH };

  public static void main(String[] args) {
      EnumSet<Style> enumSet = EnumSet.range(Style.BOLD, Style.UNDERLINE);
      for (Style style : enumSet) {
          System.out.print(style + " ");
      }
  }

  // **BOLD ITALIC UNDERLINE**
  ```

### Reference

- Effective Java
- Oracle Documentation
