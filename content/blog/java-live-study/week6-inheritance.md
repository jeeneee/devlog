---
title: '[java-live-study] 6주차-상속'
date: 2020-12-27 17:26:27
category: 'java-live-study'
draft: false
---

![whiteship](images/whiteship-logo.jpg)

## 자바 상속의 특징

객체지향 프로그래밍에서 상속은 중요한 개념으로, 이를 통해 다른 클래스의 필드와 메서드를 가져올 수 있다. 그러면 코드의 재사용성이 높아지고 코드의 중복을 줄여 생산성과 유지보수에 많은 도움이 된다.

상속을 거듭할수록 멤버의 수는 확장되기에 자바에선 `extends`란 키워드로 클래스를 상속한다.

```java
class Vehicle {             // 조상 클래스
    private int speed;
    int numberOfSeats;

    Vehicle(int numberOfSeats) {
        this.speed = 0;
        this.numberOfSeats = numberOfSeats;
    }

    public void speedUp(int increment) {
        speed += increment;
    }

    public void speedDown(int decrement) {
        speed -= decrement;
    }

    public int getSpeed() {
        return speed;
    }
}

class Car extends Vehicle { // 자손 클래스
    int maxSpeed;

    Car(int maxSpeed, int numberOfSeats) {
        super(numberOfSeats);
        this.maxSpeed = maxSpeed;
    }
}
```

> **조상 클래스** - 부모 클래스 또는 상위(super) 클래스. 상속해주는 클래스이다.  
> **자손 클래스** - 자식 클래스 또는 하위(sub) 클래스. 상속받는 클래스이다.

위 예제에서 `Car`클래스는 `Vehicle`클래스를 상속받는다. 따라서 `Car`클래스에 `speedUp`, `speedDown`, `getSpeed`메서드를 따로 작성하지 않아도 사용할 수 있어 아래와 같은 코드가 가능하다.

```java
Car ferrari = new Car(300, 2);
ferrari.speedUp(100);
ferrari.speedDown(20);
System.out.println(ferrari.getSpeed());  // 80
```

- `private`멤버는 상속되지 않는다. 하지만 getter메서드를 통해 가져올 수 있다.
- 생성자와 초기화 블럭은 상속되지 않지만, 하위 클래스에서 상위(super) 클래스의 생성자를 호출할 수 있다.
- `Object`클래스를 제외한 모든 클래스는 하나 이상의 조상 클래스를 갖는데, 임의의 클래스를 명시적으로 상속받지 않으면 최상위 클래스인 `Object`클래스에게 상속을 받는다.
- 다중 상속이 불가능하다.(단, 인터페이스로 가능)

## super 키워드

Java의 `super` 키워드는 부모 클래스 객체를 참조하는 데 사용되는 참조 변수이다. 주로 다음과 같은 상황에 쓰인다.

- **부모 클래스의 변수**

  ```java
  class Vehicle {             // 부모 클래스
      int maxSpeed = 200;
  }

  class Car extends Vehicle { // 자식 클래스
      int maxSpeed = 300;

      void print() {
          System.out.println("maxSpeed = " + super.maxSpeed);
      }
  }

  class Main {
      public static void main(String[] args) {
          Car car = new Car();
          car.print();    // 200
      }
  }
  ```

- **부모 클래스의 메서드**

  ```java
  class Parent {

      void print() {
          System.out.println("parent");
      }
  }

  class Child extends Parent {

      void print() {
          System.out.println("child");
      }

      void printAll() {
          print();        // child
          super.print();  // parent
      }
  }

  class Main {
      public static void main(String[] args) {
          Child child = new Child();
          child.printAll();
      }
  }
  ```

- **부모 클래스의 생성자**

  ```java
  class Parent {
      Parent() {
          System.out.println("parent constructor");
      }
  }

  class Child extends Parent {
      Child() {
          super();
          System.out.println("child constructor");
      }
  }

  class Main {
      public static void main(String[] args) {
          Child child = new Child();
      }
  }
  // 실행 결과
  parent constructor
  child constructor
  ```

  위 코드에서 `super()`기본 생성자는 생략해도 된다. 왜냐하면 컴파일러가 자동으로 기본 생성자를 생성하기 때문이다. 만일 위와 같이 명시적으로 생성자를 선언하려면 반드시 첫 줄에 작성해야 한다. 그렇지 않으면 컴파일 에러가 발생한다.

## 메서드 오버라이딩

상속을 받으면 자손 클래스에서 조상 클래스의 메서드를 쓸 수 있다고 했다. 하지만 이러한 메서드를 자손 클래스에 맞게 구현부를 변경할 수 있는데, 이를 메서드 오버라이딩(overriding)이라 한다.

```java
class Parent {
    void print() {
        System.out.println("parent");
    }
}

class Child extends Parent {
    @Override
    void print() {
        System.out.println("child");
    }
}

public class Main {
    public static void main(String[] args) {
        Parent parent = new Parent();
        Child child = new Child();
        parent.print(); // parent
        child.print();  // child
    }
}
```

### 오버라이딩 규칙

- 조상 클래스의 메서드와 이름, 매개변수, 그리고 반환타입이 같아야 한다. 단, Java 5.0부터 공변 반환타입(covariant return type)이 추가되어 자손 클래스의 타입을 반환할 수 있게 되었다.
- 접근 제어자는 조상 클래스의 메서드보다 좁은 범위로 변경할 수 없다.
- 조상 클래스 메서드의 예외 관계
  - 조상 클래스의 메서드에 예외 선언이 되어있지 않으면 unchecked 예외만 선언할 수 있다. 그렇기 때문에 checked 예외를 선언한다면 컴파일 에러가 발생한다.
  - 예외가 선언되어 있다면 같은 예외 혹은 자손 클래스에 해당하는 예외를 선언할 수 있다.
- `final`, `private` 메서드는 상속될 수 없다.
- `static` 메서드는 상속될 수 없다. (메서드 하이딩)
- 오버라이딩 메서드를 정의할 때는 `@override` 어노테이션을 명시적으로 선언하는 것이 좋다. 어노테이션에 관한 내용은 12주차에 다룰 예정이다.

### 오버로딩

오버라이딩과 비슷한 단어이지만 둘은 완전히 다르다. 오버로딩은 한 클래스 내에서 같은 이름의 메서드 정의을 허용한다. 그렇기에 오버로딩이 성립하기 위해선 메서드 이름이 같아야 하고, 매개 변수의 개수 또는 타입이 달라야 한다. 전적으로 메서드 시그니쳐(signature)와 관계있다.

```java
int mul(int a, int b) {}
long mul(long a, long b) {}
long mul(int[] arr) {}
```

## 메서드 디스패치

자바에서 다형성은 컴파일 타임 다형성(compile-time polymorphism)과 런타임 다형성(runtime polymorphism)으로 나뉜다. 그리고 이러한 다형성을 구현하기 위해 아래와 같은 메커니즘이 존재한다.

- **스태틱 메서드 디스패치(static method dispatch)**

  정적 바인딩(static binding) / 컴파일 타임 바인딩(compile-time binding) / 이른 바인딩(early binding)이라고도 불린다. 바인딩이란 임의의 코드에서 함수를 호출할 때 해당 함수가 위치한 주소로 매핑해주는 것을 의미한다. 따라서 스태틱 메서드 디스패치는 컴파일 되는 시점에 컴파일러가 어떤 클래스의 메서드를 실행할지 미리 정해진다. 오버로딩이 여기 속한다.

- **다이나믹 메서드 디스패치(dynamic method dispatch)**

  동적 바인딩(dynamic binding) / 런타임 바인딩(runtime binding) / 늦은 바인딩(late binding)이라고도 불린다. 스태틱 메서드 디스패치와 달리, 컴파일 되는 시점에 어떤 클래스의 메서드를 실행할지 모르고, 런타임 시점에 할당된 객체가 무엇인지 판단하고 해당 메서드를 실행한다. 오버라이딩이 대표적인 예이다.

  - 인스턴스 생성 중에 다이나믹 디스패치

    ```java
    class Super {
        Super() { printThree(); }
        void printThree() { System.out.println("three"); }
    }

    class Test extends Super {
        int three = 3;
        @Override
        void printThree() { System.out.println(three); }
        public static void main(String[] args) {
            Test t = new Test();
            t.printThree();
        }
    }
    // 실행 결과
    0
    3
    ```

    `Super`클래스의 생성자에서 `printThree`메서드를 호출하면 `Test`클래스의 오버라이딩된 `printThree`메서드가 호출된다. 하지만 아직 필드 초기화가 진행되지 않아서 기본값인 0이 출력된 것이다.

- **더블 디스패치(double dispatch)**

  더블이란 용어가 붙은 이유가 있다. 다이나믹 메서드 디스패치를 두 번 실행한다.

  _예제 코드 출처: [토비님의 유튜브 영상](https://www.youtube.com/watch?v=s-tXAHub6vg)_

  ```java
  public class doubleDispatch {
      interface Post { void postOn(SNS sns); }

      static class Text implements Post {
          public void postOn(SNS sns) {
              System.out.println("text -> " + sns.getClass().getSimpleName());
          }
      }

      static class Picture implements Post {
          public void postOn(SNS sns) {
              System.out.println("picture -> " + sns.getClass().getSimpleName());
          }
      }

      interface SNS {}
      static class Facebook implements SNS {}
      static class Twitter implements SNS {}

      public static void main(String[] args) {
          List<Post> posts = Arrays.asList(new Text(), new Picture());
          List<SNS> sns = Arrays.asList(new Facebook(), new Twitter());
          posts.forEach(p->sns.forEach(s->p.postOn(s)));
      }
  }
  ```

  글과 사진이 담긴 게시물을 페이스북, 트위터에 업로드하는 코드라 가정한다. 여기선 `s`가 무엇인지에 따라 `postOn(SNS sns)`메서드가 결정되므로 다이나믹 메서드 디스패치가 한 번 실행된다. 만일 sns와 게시물의 조합마다 각기 다른 비즈니스 로직을 갖고 있다면 어떻게 작성할 수 있을까?

  ```java
  public class doubleDispatch {
      interface Post { void postOn(SNS sns); }

      static class Text implements Post {
          public void postOn(SNS sns) {
              if (sns instanceof Facebook) {
                  System.out.println("text -> facebook");
              }
              else if (sns instanceof Twitter) {
                  System.out.println("text -> twitter");
              }
          }
      }

      static class Picture implements Post {
          public void postOn(SNS sns) {
              if (sns instanceof Facebook) {
                  System.out.println("picture -> facebook");
              }
              else if (sns instanceof Twitter) {
                  System.out.println("picture -> twitter");
              }
          }
      }

      interface SNS {}
      static class Facebook implements SNS {}
      static class Twitter implements SNS {}

      public static void main(String[] args) {
          List<Post> posts = Arrays.asList(new Text(), new Picture());
          List<SNS> sns = Arrays.asList(new Facebook(), new Twitter());
          posts.forEach(p->sns.forEach(s->p.postOn(s)));
      }
  }
  ```

  이렇게 `Text`, `Picture` 클래스마다 `SNS`로 분기를 나누어 처리할 수 있겠다. 하지만 이 코드는 `if`문을 썼기 때문에 타입을 추가할 때마다 엄격하게 체크해야 하는 번거로움이 생길 뿐만 아니라 실수가 생길 수 있어 오류를 범할 수 있다. 이를 좀 더 객체지향적으로 설계해보자.

  ```java
  public class doubleDispatch {
      interface Post { void postOn(SNS sns); }

      static class Text implements Post {
          public void postOn(SNS sns) { sns.post(this); }
      }

      static class Picture implements Post {
          public void postOn(SNS sns) { sns.post(this); }
      }

      interface SNS {
          void post(Text post);
          void post(Picture post);
      }

      static class Facebook implements SNS {
          public void post(Text post) { System.out.println("text -> facebook"); }
          public void post(Picture post) { System.out.println("picture -> facebook");}
      }

      static class Twitter implements SNS {
          public void post(Text post) { System.out.println("text -> twitter"); }
          public void post(Picture post) { System.out.println("picture -> twitter"); }
      }

      public static void main(String[] args) {
          List<Post> posts = Arrays.asList(new Text(), new Picture());
          List<SNS> sns = Arrays.asList(new Facebook(), new Twitter());
          posts.forEach(p->sns.forEach(s->p.postOn(s)));
      }
  }
  ```

  비즈니스 로직을 한 단계 더 들어가서 `SNS`에 떠맡긴 것을 볼 수 있다. 이렇게 되면 `Post`와 `SNS`에서 다이나믹 메서드 디스패치가 한 번씩, 총 두 번 실행된다. 이와 같은 메커니즘이 적용된 디자인 패턴으로 **방문자 패턴(Visitor pattern)**이 있는데, 데이터 구조와 연산을 분리함으로써 구조를 수정하지 않고도 새로운 연산을 기존의 데이터 구조에 추가할 수 있게 된다. 개방-폐쇄 원칙(OCP)을 적용하는 방법 중 하나이다.

## 추상 클래스

추상 클래스는 미완성 클래스이자 클래스를 만들기 위한 클래스로써, 이 자체로 인스턴스를 생성할 수 없다. 추상 메서드의 포함 여부가 추상 클래스임을 단정짓는 것이 아니고 클래스 선언부 앞에 `abstract` 제어자가 있어야 추상 클래스이다.

추상 메서드는 아래와 같이 구현부 없이 선언된 메서드이다. 중괄호가 없는 대신 세미콜론이 붙는다.

```java
abstract void calc(int a, int b);
```

하나 이상의 추상 메서드를 포함하면 해당 클래스는 반드시 추상 클래스여야만 한다.

```java
public abstract class GraphicObject {
    int x, y;
    ...
    void moveTo(int newX, int newY) {
        ...
    }
    abstract void draw();
    abstract void resize();
}
```

> 추상 클래스가 상속될 때, 자식 클래스는 일반적으로 부모 클래스의 모든 추상 메서드를 구현한다.  
> 그렇지 않은 경우엔 자식 클래스도 추상 클래스로 선언되어야 한다.

도형 그리기 어플리케이션에서 원, 직사각형 등 여러 도형 객체를 그릴 수 있다고 예를 들어보자. 각 객체들은 상태와 동작을 갖는데, 이 중 일부(위치, 색칠하기, 이동 등)는 서로 동일한 반면에 다른 일부(크기 조정 및 그리기)는 구현을 달리 해야할 필요가 있다. 이런 경우에 위의 추상 클래스를 이용하여 객체지향적으로 설계할 수 있다.

```java
class Circle extends GraphicObject {
    void draw() {
        ...
    }
    void resize() {
        ...
    }
}
class Rectangle extends GraphicObject {
    void draw() {
        ...
    }
    void resize() {
        ...
    }
}
```

## Object 클래스

`java.lang` 패키지에 포함된 `Object` 클래스는 클래스 계층 구조 맨 위에 위치한 최상위 클래스이다. 모든 클래스는 직ㆍ간접적으로 `Object` 클래스의 자손 클래스이므로 아래 11개의 메서드들을 상속받아 쓸 수 있다.  
![](images/week6/object-methods.png)
