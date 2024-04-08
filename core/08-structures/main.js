const AbstractDataType = require("./AbstractDataType/AbstractDataType.js");

class Struct extends AbstractDataType {
  constructor(scheme) {
    super();
    this.isStruct = true;
    this.scheme = scheme;
    this.shape = {};
  }

  buildShape() {
    this.shape = Struct.getShape(this.scheme);
  }

  static getShape(scheme) {
    const result = {};

    const getShape = (scheme) => {
      for (const [k, v] of Object.entries(scheme)) {
        if (v.isTuple) result[k] = Tuple.getShape(v.types);
        else if (v.isStruct) result[k] = Struct.getShape(v.scheme);
        else result[k] = v;
      }
    };

    getShape(scheme);

    return result;
  }
}

class Tuple extends AbstractDataType {
  constructor(...types) {
    super();
    this.isTuple = true;
    this.types = types;
    this.shape = {};
  }

  buildShape() {
    this.shape = Tuple.getShape(this.types);
  }

  static getShape(types) {
    const shape = {};

    const getShape = (types) => {
      for (let i = 0; i < types.length; i++) {
        const type = types[i];
        if (type.isStruct) shape[i] = Struct.getShape(type.scheme);
        else if (type.isTuple) shape[i] = Tuple.getShape(type.types);
        else shape[i] = type;
      }
    };

    getShape(types);

    return shape;
  }
}

// Usages

{
  const Skills = new Struct({
    singing: Struct.U8, // Unsigned число 8 бит
    dancing: Struct.U8,
    fighting: Struct.U8,
  });
  const Color = new Tuple(Struct.U8, Struct.U8, Struct.U8);
  const Person = new Struct({
    firstName: Struct.String("ASCII", 3), // Строка в кодировке ASCII
    lastName: Struct.String("ASCII", 4),
    age: Struct.U8,
    skills: Skills,
    color: Color,
  });
  const bob = Person.create({
    firstName: "Bob", // Тут придется сконвертировать UTF-16 в ASCII
    lastName: "King",
    age: 42,
    skills: { singing: 100, dancing: 100, fighting: 50 },
    color: [255, 0, 200],
  });

  // Uncomment to see all values
  //   for (const [k] of Object.entries(bob.markup)) {
  //     console.log(Person[k]);
  //   }
  const bobClone = bob.from(bob.buffer);
  bobClone["firstName"] = "Foo";
  console.log(bob["firstName"], bobClone["firstName"]);
}

// {
//   // Struct
//   const Person = new Struct({
//     firstName: Struct.String("ASCII", 4),
//     lastName: Struct.String("ASCII", 3),
//     age: Struct.U8,
//   });
//   Person.create({
//     firstName: "John",
//     lastName: "Doe",
//     age: 42,
//   });

//   // Before changes
//   {
//     console.log("Before changes:");
//     const firstName = Person["firstName"];
//     console.log(firstName);
//     const lastName = Person["lastName"];
//     console.log(lastName);
//     const age = Person["age"];
//     console.log(age);
//   }

//   // After Changes
//   {
//     console.log("After Changes:");
//     Person["firstName"] = "Rick";
//     Person["age"] = Person["age"] - 10;
//     const firstName = Person["firstName"];
//     console.log(firstName);
//     const age = Person["age"];
//     console.log(age);
//   }
// }

console.log("\n");

// {
//   // Nested Structs
//   const Family = new Struct({
//     father: new Struct({
//       firstName: Struct.String("ASCII", 4),
//       lastName: Struct.String("ASCII", 3),
//     }),
//   });
//   Family.create({
//     father: {
//       firstName: "John",
//       lastName: "Doe",
//     },
//   });

//   console.log(Family["father.firstName"]);
//   Family["father.firstName"] = "Rick";
//   console.log(Family["father.firstName"]);
// }

console.log("\n");

{
  const Father = new Struct({
    firstName: Struct.String("ASCII", 5),
    lastName: Struct.String("ASCII", 3),
    age: Struct.U8,
  });
  const fatherData = {
    firstName: "John",
    lastName: "Doe",
    age: 40,
  };

  const Color = new Tuple(Struct.U8, Struct.U8, Struct.U8);
  const Child = new Struct({
    firstName: Struct.String("ASCII", 4),
    lastName: Struct.String("ASCII", 3),
    age: Struct.U8,
    favoriteColor: Color,
  });
  const childData = {
    firstName: "Rick",
    lastName: "Doe",
    age: 17,
    favoriteColor: [255, 110, 115],
  };

  const Mother = new Struct({
    firstName: Struct.String("ASCII", 9),
    lastName: Struct.String("ASCII", 3),
    age: Struct.U8,
    occupationCode: Struct.U32,
  });
  const motherData = {
    firstName: "Elisabeth",
    lastName: "Doe",
    age: 37,
    occupationCode: 1234,
  };

  const Family = new Struct({
    mother: Mother,
    father: Father,
    child: Child,
  });

  Family.create({
    mother: motherData,
    father: fatherData,
    child: childData,
  });

  console.log(Family);

  console.log("Family:", Family);
  for (const [k] of Object.entries(Family.markup)) {
    console.log(Family[k]);
  }
}

// {
//   const Color = new Tuple(Struct.U8, Struct.U8, Struct.U8);
//   const Person = new Struct({
//     firstName: Struct.String("ASCII", 4),
//     lastName: Struct.String("ASCII", 3),
//     age: Struct.U8,
//     favoriteColor: Color,
//   });
//   Person.create({
//     firstName: "John",
//     lastName: "Doe",
//     age: 42,
//     favoriteColor: [255, 255, 0],
//   });

//   console.log(Person.scheme);

//   const firstName = Person["firstName"];
//   console.log(firstName);
//   const lastName = Person["lastName"];
//   console.log(lastName);
//   const age = Person["age"];
//   console.log(age);
//   const favoriteColor = [
//     Person["favoriteColor.0"],
//     Person["favoriteColor.1"],
//     Person["favoriteColor.2"],
//   ];
//   console.log(favoriteColor);
// }

// {
//   // Nested Tuples:
//   const Color = new Tuple(
//     Struct.U8,
//     Struct.U8,
//     Struct.U8,
//     new Tuple(Struct.U8, Struct.U8, Struct.U8),
//   );
//   console.log(Color);
//   Color.create(255, 255, 0, [1, 2, 3]);
// }

// {
//   // Nested Structs
//   const Person = new Struct({
//     firstName: Struct.String("ASCII", 4),
//     lastName: Struct.String("ASCII", 3),
//     mother: new Struct({
//       firstName: Struct.String("ASCII", 5),
//       lastName: Struct.String("ASCII", 3),
//     }),
//   });

//   Person.create({
//     firstName: "John",
//     lastName: "Doe",
//     mother: {
//       firstName: "Alice",
//       lastName: "Doe",
//     },
//   });
// }
