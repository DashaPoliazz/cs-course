const Color = new Tuple(Struct.U8, Struct.U8, Struct.U8);

const p = new Struct({
  name: Struct.String("ASCII"),
  age: Struct.U8,
  favoriteColor: Color,
});

// {
// 	0 -> name: {
// 		isTerminal: true,
// 		metaData: [byteOffset, getView, setView],
// 	},
// 	1 -> age: {
// 		isTerminal: true,
// 		metaData: [byteOffset, getView, setView],
// 	},
// 	2 -> favoriteColor: {
// 		isTerminal: false,
// 		metaData: [byteOffset, getView, setView],
// 		0 -> {
// 			isTerminal: true,
// 			metaData: [byteOffset, getView, setView],
// 		},
// 		1 -> {
// 			isTerminal: true,
// 			metaData: [byteOffset, getView, setView],
// 		},
// 		2 -> {
// 			isTerminal: true,
// 			metaData: [byteOffset, getView, setView],
// 		},
// 	}
// }
