---
title: Single Inheritance
id: 9rf6ljhwjv1k32kxc2p41vg
created: 1728247001137
updated: 1728247002137
---

**Single Inheritance** is a feature of object-oriented programming where a class can inherit from only one parent class.

## Key Points

- Promotes a simple and clear hierarchy.
- Avoids ambiguity present in multiple inheritance.
- Common in languages like Java and C#.

## Example

```java
class Animal {
  void eat() {}
}

class Dog extends Animal {
  void bark() {}
}
```

Here, `Dog` inherits from `Animal` only.

## Advantages

- Simpler to understand and maintain.
- No "diamond problem" as in multiple inheritance.

## Limitations

- Less flexibility compared to multiple inheritance.
- May require more code reuse via interfaces or composition.
