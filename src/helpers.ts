export interface Factory<K, T> {
    create(kwargs: K): T;
}

export function staticImplements<T>() {
    return <U extends T>(constructor: U) => {
        constructor;
    };
}

// function deserialize<T, M>(fn: (t: T) => M ) {

//     return function(target: )
// }

// export class SerializationHelper {
//     static toInstance<T>(obj: T, json: string): T {
//         const jsonObj = JSON.parse(json);

//         if (typeof obj["fromJSON"] === "function") {
//             obj["fromJSON"](jsonObj);
//         } else {
//             for (const propName in jsonObj) {
//                 obj[propName] = jsonObj[propName];
//             }
//         }

//         return obj;
//     }
// }
